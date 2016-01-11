'use strict';

var _ = require('lodash');
var mapper = require('./../lib/mapper.js');
var messages = require('elasticio-node').messages;
var debug = require('debug')('venzee-mapper');

exports.process = processMessage;

function processMessage(msg, cfg) {

    debug('Message: %j', msg.body);
    debug('Mapping: %j', cfg.mapper);

    let result = mapper.map(msg.body, cfg.mapper);

    debug('Emit: %j', result);

    this.emit('data', messages.newMessageWithBody(result));
    this.emit('end');
}
