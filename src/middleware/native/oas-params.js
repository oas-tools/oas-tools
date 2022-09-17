import _ from "lodash";
import { schema } from "../../utils/index.js";
import { OASBase, logger } from "@oas-tools/commons";

export class OASParams extends OASBase {

    constructor(oasFile, middleware) {
        super(oasFile, middleware);
    }

    static initialize(oasFile, _config) {
        return new OASParams(oasFile, (req, res, next) => {
            const oasRequest = oasFile.paths[req.route.path]?.[req.method.toLowerCase()];
            const pathParams = oasFile.paths[req.route.path]?.parameters;
            const methodParams = oasRequest?.parameters;
            const params = _.merge(pathParams, methodParams);
            const paramsObj = {};
            let body = req.body;
            if (oasRequest.requestBody) {
                const contentType = Object.keys(oasRequest.requestBody.content)[0];
                body = schema.parseBody(body, oasRequest.requestBody.content[contentType].schema);
            }
            Object.values(params).forEach((param) => paramsObj[param.name] = _getParameterValue(req, param));
            res.defaultSend = res.send; // save original send for error handling
            res.locals.oas = { params: paramsObj, body: body };
            if(req.file || req.files && req.files.length > 0) res.locals.oas.files = [req.files, req.file].flat().filter((file) => file !== undefined);
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
    const defaultVal = parameter.schema ? parameter.schema.default : undefined;
    const paramLocation = parameter.in;
    let val;
    
    /* The following code takes into account OAS serialization. https://swagger.io/docs/specification/serialization/ */
    switch (paramLocation) {
        case "path": // transform any style,explode param into default (style=simple, explode=false)
            if (parameter.explode){
                if (parameter.style === "label") val = req.params[parameter.name]?.replace('.','').replace(/\./g, ',').replace(/[=]/g, ',');
                else if (parameter.style === "matrix") val = req.params[parameter.name]?.replace(';', '').replace(new RegExp(`${parameter.name}=`,"g"), '').replace(/;/g, ',').replace(/[=]/g, ',');
                else val = req.params[parameter.name].replace(/[=]/g, ',');
                break;
            } else {
                if (parameter.style === "label") val = req.params[parameter.name]?.replace('.', '');
                else if (parameter.style === "matrix") val = req.params[parameter.name]?.replace(`;${parameter.name}=`, '');
                else val = req.params[parameter.name];
                break;
            }
        case "query": // transform any style,explode param into default (style=form, explode=true)
            if (parameter.content) { // ignores style and explode when content is defined
                val = _.get(req.query, parameter.name);
                break;
            } else if(parameter.explode === false) {
                if (parameter.style === "spaceDelimited") val = _.get(req.query, parameter.name)?.replace(/\s/g, ',');
                else if (parameter.style === "pipeDelimited") val = _.get(req.query, parameter.name)?.replace(/\|/g, ',');
                else val = _.get(req.query, parameter.name)?.replace(`${parameter.name}=`, '');
                break;
            } else {
                if ((parameter.style === undefined || parameter.style === "form") && _getType(parameter.schema) === "object") val = req.query;
                else val = _.get(req.query, parameter.name);
                break;
            }
        case "header": // transform any style,explode param into default (style=simple, explode=false)
            if (!parameter.content && parameter.explode){ // ignores style and explode when content is defined
                val = req.headers[parameter.name.toLowerCase()]?.replace(/[=]/g, ',');
            } else {
                val = req.headers[parameter.name.toLowerCase()];
            }
            break;
        case "cookie":
            val = req.headers.cookie?.split(';').find((c) => c.trim().startsWith(`${parameter.name}=`))?.split('=')[1];
            break;    
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
    const type = _getType(schema);
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
            return val;
        case "number":
        case "integer":
            if (typeof val !== "string") return val;
            return isNaN(Number(val)) ? val : Number(val);
        case "boolean":
            if (typeof val === "boolean") return val;
            if (val === "true") return true;
            return val === "false" ? false : val;
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
                }
            } else {
                logger.warn(`Parameter [${paramDefinition.name}] sent in the ${paramDefinition.in} is an object. Consider using content instead of schema or send it in request body.`);
                if(typeof val === 'object') return val;
                const map = new Map(val.split(',').reduce((res, _val, idx, arr) => {
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
