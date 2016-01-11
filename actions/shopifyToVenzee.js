'use strict';

var _ = require('lodash');
var mapper = require('./../lib/mapper.js');
var messages = require('elasticio-node').messages;
var debug = require('debug')('venzee-mapper');

exports.process = processMessage;

function processMessage(msg, cfg) {

    var self = this;
    var product = msg.body;
    let mapping = cfg.mapper;

    debug('Mapping: %j', mapping);
    debug('Arrived: %j', msg.body);

    // emit 1 record for each variant
    _.forEach(product.variants, function(variant) {
        let data = _.extend(_.cloneDeep(product), {variant: variant});
        let result = mapper.map(data, mapping);
        emitData(result);
    });

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
