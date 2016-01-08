'use strict';

var _ = require('lodash');
var mapper = require('./../lib/mapper.js');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;
var debug = require('debug')('venzee-mapper');

exports.process = processMessage;

function processMessage(msg, cfg) {

    var self = this;
    var data = msg.body;
    let mapping = cfg.mapper;

    debug('Mapping: %j', mapping);
    debug('Arrived: %j', msg.body);

    let result = mapper.map(data, mapping);
    emitData(result);
    emitEnd();

    function emitData(body) {
        debug('Emit: %j', body);
        self.emit('data', messages.newMessageWithBody(body));
    }

    function emitEnd() {
        self.emit('end');
    }
}
