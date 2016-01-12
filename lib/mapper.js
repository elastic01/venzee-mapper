'use strict';

var _ = require('lodash');
var array_mapper = require('./array_mapper.js');

exports.hasProperty = hasProperty;
exports.getProperty = getProperty;
exports.map = map;

const SIMPLE_PROPERTY_REGEXP = /^{{(.*?)}}$/;
const ALL_PLACEHOLDERS_REGEXP = /{{(.*?)}}/g;

function isSimpleProperty(mapping) {
    return SIMPLE_PROPERTY_REGEXP.test(mapping);
}

function getPath(mapping) {
    return mapping.replace(/^{{(.*)}}$/g, '$1');
}

function getSimpleProperty(obj, mapping) {
    return _.get(obj, getPath(mapping));
}

function getComplexProperty(obj, mapping) {
    let result = mapping;
    let placeholders = mapping.match(ALL_PLACEHOLDERS_REGEXP);
    _.forEach(placeholders, function (placeholder) {
        let value = getSimpleProperty(obj, placeholder);
        result = result.replace(placeholder, value);
    });
    return result;
}

function getProperty(obj, mapping) {
    if (isSimpleProperty(mapping)) {
        return getSimpleProperty(obj, mapping);
    } else {
        return getComplexProperty(obj, mapping);
    }
}

function hasProperty(obj, mapping) {
    if (isSimpleProperty(mapping)) {
        return _.has(obj, getPath(mapping));
    } else {
        return true;
    }
}

function map(data, mapping) {

    mapping = array_mapper.iterateIndexes(mapping, data);

    return _.transform(mapping, function(result, subMapping, key) {
        if (typeof(subMapping) === "string") {
            if (hasProperty(data, subMapping)) {
                result[key] = getProperty(data, subMapping);
            }
        } else {
            result[key] = map(data, subMapping);
        }
    });
}
