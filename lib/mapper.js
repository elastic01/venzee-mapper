'use strict';

var _ = require('lodash');
var array_mapper = require('./array_mapper.js');

exports.hasProperty = hasProperty;
exports.getProperty = getProperty;
exports.map = map;

function getPath(mapping) {
    return mapping.replace(/^{{(.*)}}$/g, '$1');
}

function hasProperty(obj, mapping) {
    return _.has(obj, getPath(mapping));
}

function getProperty(obj, mapping) {
    return _.get(obj, getPath(mapping));
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
