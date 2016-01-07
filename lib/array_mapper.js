'use strict';

var _ = require('lodash');
var mapper = require('./mapper.js');

const ARRAY_PLACEHOLDER= /\[\*\]/;

exports.iterateIndexes = iterateIndexes;

function hasArrayPlaceholder(value){
    return ARRAY_PLACEHOLDER.test(value);
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

function isMissingIndex(data, mapping, index) {
    let result = false;
    _.cloneDeep(mapping, function(value) {
        if (typeof(value) === "string" && hasArrayPlaceholder(value)) {
            let subMapping = setArrayIndex(value, index);
            if (!mapper.hasProperty(data, subMapping)) {
                result = true;
            }
        }
    });
    return result;
}

function* getSubMappings(subMapping, data) {
    var i = 0;
    while (i < 10) {
        if (isMissingIndex(data, subMapping, i)) break;
        yield setArrayIndex(subMapping, i);
        i++;
    }
}

function iterateIndexes(mapping, data){
    return _.transform(_.cloneDeep(mapping), function(result, subMapping, key) {
        if (hasArrayPlaceholder(key)) {
            key = removeArrayPlaceholder(key);
            result[key] = result[key] || [];
            for (let indexedMapping of getSubMappings(subMapping, data)) {
                result[key].push(indexedMapping);
            }
        } else {
            if (typeof(subMapping) === "string") {
                result[key] = subMapping;
            } else {
                result[key] = iterateIndexes(subMapping, data);
            }
        }
    });
}
