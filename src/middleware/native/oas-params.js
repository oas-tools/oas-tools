import { OASBase } from "oas-devtools/middleware";
import { logger } from "oas-devtools/utils";
import _ from "lodash";

export class OASParams extends OASBase {

    constructor(oasFile, middleware) {
        super(oasFile, middleware);
    }

    static initialize(oasFile, config) {
        return new OASParams(oasFile, (req, res, next) => {
            let methodParams = oasFile.paths[req.route.path]?.[req.method.toLowerCase()]?.parameters;
            let pathParams = oasFile.paths[req.route.path]?.parameters;
            let params = _.merge(pathParams, methodParams);
            let paramsObj = {};
            Object.values(params).forEach(param => paramsObj[param.name] = _getParameterValue(req, param));
            res.defaultSend = res.send; // save original send for error handling
            res.locals.oas = { params: paramsObj, body: req.body };
            if(req.file || req.files && req.files.length > 0) res.locals.oas.files = [req.files, req.file].flat().filter(file => file !== undefined);
            next()
        });
    }
}

/**
 * Gets parameters from the request.
 * @param {string} req - Server request.
 * @param {string} parameter - OAS Object containing parameter definition.
 */
function _getParameterValue(req, parameter) {
    let defaultVal = parameter.schema ? parameter.schema.default : undefined;
    let paramLocation = parameter.in;
    let val;
    
    /* The following code takes into account OAS serialization. https://swagger.io/docs/specification/serialization/ */
    switch (paramLocation) {
        case "path": // transform any style,explode param into default (style=simple, explode=false)
            if (parameter.explode){
                if (parameter.style === "label") val = req.params[parameter.name]?.replace('.','').replaceAll('.', ',').replaceAll('=', ',');
                else if (parameter.style === "matrix") val = req.params[parameter.name]?.replace(';', '').replaceAll(`${parameter.name}=`, '').replaceAll(';', ',').replaceAll('=', ',');
                else val = req.params[parameter.name].replaceAll('=', ','); break;
            } else {
                if (parameter.style === "label") val = req.params[parameter.name]?.replace('.', '');
                else if (parameter.style === "matrix") val = req.params[parameter.name]?.replace(`;${parameter.name}=`, '');
                else val = req.params[parameter.name]; break;
            }
        case "query": // transform any style,explode param into default (style=form, explode=true)
            if (parameter.content) { // ignores style and explode when content is defined
                val = _.get(req.query, parameter.name); break;
            } else if(parameter.explode === false) {
                if (parameter.style === "spaceDelimited") val = _.get(req.query, parameter.name)?.replaceAll(' ', ',');
                else if (parameter.style === "pipeDelimited") val = _.get(req.query, parameter.name)?.replaceAll('|', ',');
                else val = _.get(req.query, parameter.name)?.replace(`${parameter.name}=`, ''); break;
            } else {
                if ((parameter.style === undefined || parameter.style === "form") && _getType(parameter.schema) === "object") val = req.query;
                else val = _.get(req.query, parameter.name); break;
            }
        case "header": // transform any style,explode param into default (style=simple, explode=false)
            if (!parameter.content && parameter.explode){ // ignores style and explode when content is defined
                val = req.headers[parameter.name.toLowerCase()].replaceAll('=', ','); break;
            } else{
                val = req.headers[parameter.name.toLowerCase()]; break;
            }
        case "cookie":
            val = req.headers.cookie?.split(';').find(c => c.trim().startsWith(`${parameter.name}=`))?.split('=')[1]; break;    
    }
    if (_.isUndefined(val) && !_.isUndefined(defaultVal)) {
        val = defaultVal;
    }

    /* Get schema and type and parse value */
    let schema;
    if (parameter.schema) schema = parameter.schema;
    else {
        const contentType = Object.keys(parameter.content)[0];
        schema = parameter.content[contentType].schema;
    }
    let type = _getType(schema);
    if (Array.isArray(type)) { // Mixed params (OAS 3.1)
        let parsedVal;
        for (const t of type) {
            parsedVal = _parseValue(val, parameter, schema, t);
            if (parsedVal !== val && t !== 'string') break;
        }
        return parsedVal;
    } else { // Single params
        return _parseValue(val, parameter, schema, type);
    }
}

function _parseValue(val, paramDefinition, schema, type) {
    if (val === undefined) return val;
    if ((schema.nullable || type === 'null') && val === null) return val;
    if (paramDefinition.allowEmptyValue && val === "") return val;
    switch (type) {
        case "null":
        case "string":
            if (typeof val !== "string") return val;
            if (schema.format === "date-time" || schema.format === "date") return new Date(val) === 'Invalid Date' ? val : new Date(val);
            return val;
        case "number":
        case "integer":
            if (typeof val !== "string") return val;
            return isNaN(Number(val)) ? val : Number(val);
        case "boolean":
            if (typeof val === "boolean") return val;
            return val === "true" ? true : val === "false" ? false : val;
        case "array":
            if (typeof val !== "string") return val;
            return val.split(',');
        case "object":
            if (paramDefinition.content) {
                const contentType = Object.keys(paramDefinition.content)[0];
                if (contentType.toLocaleLowerCase() === "application/json") {
                    return JSON.parse(val);   
                } else {
                    logger.warn(`Content type ${contentType} is not supported. Raw value will be returned.`);
                    return val
                };
            } else {
                logger.warn(`Parameter [${paramDefinition.name}] sent in the ${paramDefinition.in} is an object. Consider using content instead of schema or send it in request body.`);
                let map = new Map(val.split(',').reduce((res, _val, idx, arr) => {
                    if (idx %2 === 0) res.push(arr.slice(idx, idx + 2));
                    return res;
                }, []));
                return Object.fromEntries(map);
            }
        default:
            throw new TypeError(`Invalid type ${type} for parameter ${paramDefinition.name}`);
    }
}

function _getType(schema) {
    let type = schema.type;
    if (!type && schema.schema) type = _getType(schema.schema);
    if (!type) type = "object";
    return type;
}