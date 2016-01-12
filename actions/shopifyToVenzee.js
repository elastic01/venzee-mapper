'use strict';

var _ = require('lodash');
var mapper = require('./../lib/mapper.js');
var messages = require('elasticio-node').messages;
var debug = require('debug')('venzee-mapper');

exports.process = processMessage;

function processMessage(msg, cfg) {

    var self = this;
    var product = msg.body;
    var productMapping = cfg.mapper.product;
    var variantMapping = cfg.mapper.variant;

    debug('Product mapping: %j', productMapping);
    debug('Variant mapping: %j', variantMapping);
    debug('Arrived: %j', msg.body);

    // emit 1 record per product
    if (productMapping) {
        product.id = product.id.toString();
        let productRecord = mapper.map(product, productMapping);
        emitData(productRecord);
    }

    // emit 1 record per each variant
    if (variantMapping) {
        _.forEach(product.variants, function(variant) {
            let variantData = _.cloneDeep(variant);
            variantData.id = variantData.id.toString();
            variantData.product = product;
            let variantRecord = mapper.map(variantData, variantMapping);
            emitData(variantRecord);
        });
    }

    // emit end
    emitEnd();

    function emitData(body) {
        debug('Emit: %j', body);
        self.emit('data', messages.newMessageWithBody(body));
    }

    function emitEnd() {
        self.emit('end');
    }
}
