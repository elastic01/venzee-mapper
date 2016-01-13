'use strict';

var _ = require('lodash');
var array_mapper = require('./array_mapper.js');

exports.hasProperty = hasProperty;
exports.getProperty = getProperty;
exports.map = map;

const SIMPLE_PROPERTY_REGEXP = /^{{(.*?)}}$/;
const ALL_PLACEHOLDERS_REGEXP = /{{(.*?)}}/g;

// checks if mapping is simple like "{{prop1.prop2}}"
function isSimpleProperty(mapping) {
    return SIMPLE_PROPERTY_REGEXP.test(mapping);
}

function getSimpleProperty(obj, mapping) {
    return _.get(obj, getPath(mapping));
}

function hasSimpleProperty(obj, mapping) {
    return _.has(obj, getPath(mapping));
}

// returns prop1.prop2 from "{{prop1.prop2}}"
function getPath(mapping) {
    return mapping.replace(/^{{(.*)}}$/g, '$1');
}

// replaces all vars in complex mapping
// like "This is a {{title}} and {{description}}"
function getComplexProperty(obj, mapping) {
    let placeholders = mapping.match(ALL_PLACEHOLDERS_REGEXP);
    let result = mapping;
    _.forEach(placeholders, function (placeholder) {
        let value = getSimpleProperty(obj, placeholder);
        result = result.replace(placeholder, value);
    });
    return result;
}

// replaces all vars in complex mapping
// like "This is a {{title}} and {{description}}"
function hasComplexProperty(obj, mapping) {
    // always return true
    return true;
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
        return hasSimpleProperty(obj, mapping);
    } else {
        return hasComplexProperty(obj, mapping)
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
