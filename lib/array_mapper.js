'use strict';

var _ = require('lodash');
var mapper = require('./mapper.js');

const ARRAY_PLACEHOLDER= /\[\*\]/;

exports.iterateIndexes = iterateIndexes;

function hasArrayPlaceholder(value){
    if (typeof(value) === "string") {
        return ARRAY_PLACEHOLDER.test(value);
    } else {
        return ARRAY_PLACEHOLDER.test(JSON.stringify(value));
    }
}

function removeArrayPlaceholder(value){
    return value.replace(ARRAY_PLACEHOLDER, '');
}

function setArrayIndex(mapping, index){
    return _.cloneDeep(mapping, function(value) {
        if (typeof(value) === "string") {
            return value.replace(ARRAY_PLACEHOLDER, '[' + index + ']');
        }
    });
}

function dataIsMissing(mapping, index, data) {
    let result = false;
    _.cloneDeep(mapping, function checkMappingValue(value) {
        if (typeof(value) === "string" && hasArrayPlaceholder(value)) {
            let subMapping = setArrayIndex(value, index);
            if (!mapper.hasProperty(data, subMapping)) {
                result = true;
            }
        }
    });
    return result;
}

function* iterateMappingIndex(mapping, data) {
    var maxIterations = hasArrayPlaceholder(mapping) ? 10 : 1;
    for (let i = 0; i < maxIterations; i++) {
        if (dataIsMissing(mapping, i, data)) break;
        yield setArrayIndex(mapping, i);
    }
}

function iterateIndexes(mapping, data){
    let result = _.cloneDeep(mapping);
    return _.forEach(result, function(subMapping, key) {
        if (hasArrayPlaceholder(key)) {
            var cleanKey = removeArrayPlaceholder(key);
            result[cleanKey] = result[cleanKey] || [];
            for (let indexMapping of iterateMappingIndex(subMapping, data)) {
                result[cleanKey].push(indexMapping);
            }
            delete result[key];
        } else if (typeof(subMapping) === "object") {
            iterateIndexes(subMapping, data);
        }
    });
}
