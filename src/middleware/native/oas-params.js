import { OASBase } from "./oas-base";
import { logger } from "../../utils";
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
            res.locals.oas = { params: paramsObj, body: req.body };
            if(req.files && req.files.length > 0) res.locals.oas.files = req.files;
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

    // The following code takes into account OAS serialization. https://swagger.io/docs/specification/serialization/
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
            if(parameter.explode === false){
                if (parameter.style === "spaceDelimited") val = _.get(req.query, parameter.name)?.replaceAll(' ', ',');
                else if (parameter.style === "pipeDelimited") val = _.get(req.query, parameter.name)?.replaceAll('|', ',');
                else val = _.get(req.query, parameter.name)?.replace(`${parameter.name}=`, ''); break;
            } else {
                if ((parameter.style === undefined || parameter.style === "form") && _getType(parameter.schema) === "object") val = req.query;
                else val = _.get(req.query, parameter.name); break;
            }
        case "header": // transform any style,explode param into default (style=simple, explode=false)
            if (parameter.explode){
                val = req.headers[parameter.name.toLowerCase()].replaceAll('=', ',');; break;
            } else{
                val = req.headers[parameter.name.toLowerCase()]; break;
            }
        case "cookie":
            val = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${parameter.name}=`))?.split('=')[1]; break;    
    }
    if (_.isUndefined(val) && !_.isUndefined(defaultVal)) {
        val = defaultVal;
    }
    return _parseValue(val, parameter);
}

function _parseValue(val, paramDefinition) {
    let schema = paramDefinition.schema;
    let type = _getType(schema);

    if (val === undefined) return val;
    if (schema.nullable && val === null) return val;
    if (paramDefinition.allowEmptyValue && val === "") return val;
    switch (type) {
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
            logger.warn("Sending objects on path, query, header, or cookie parameters may fail for complex schemas. Consider using request body instead");
            let map = new Map(val.split(',').reduce((res, _val, idx, arr) => {
                if (idx %2 === 0) res.push(arr.slice(idx, idx + 2));
                return res;
            }, []));
            return Object.fromEntries(map);
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