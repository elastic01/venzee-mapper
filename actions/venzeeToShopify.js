'use strict';

var _ = require('lodash');
var messages = require('elasticio-node').messages;
var mapper = require('./../lib/mapper.js');
var debug = require('debug')('venzee-mapper');

exports.process = processMessage;

function processMessage(msg, cfg) {

    var self = this;
    var records = msg.body.records || [msg.body];
    let mapping = cfg.mapper;

    debug('Mapping: %j', mapping);
    debug('Arrived: %j', msg.body);

    _.forEach(records, function(record){
        // emit each venzee record
        let result = mapper.map(record, mapping);
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