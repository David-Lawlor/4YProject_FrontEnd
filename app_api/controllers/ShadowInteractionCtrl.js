var request = require('request');
var moment = require("moment");
var crypto = require("crypto-js");
var AWS = require("aws-sdk");
var responseCreator = require('./ResponseCreator');
var logger = require('winston');

module.exports.updateShadow = function(req, res) {
    var iotendpoint = process.env.iotendpoint;
    var relay = req.body.relay;
    var state = req.body.state;

    logger.log("info", "shadow update function called", {"relay": relay, "State": state});

    if((state != 'ON' && state != 'OFF') || isNaN(relay)){
        logger.log("error", "relay state does not meet required criteria");
        return responseCreator.sendResponse(res, 404, []);
    }

    var iotdata = new AWS.IotData({endpoint: iotendpoint});

    var changePayload = '{"state": {"desired": {"relay' + (relay) + '": "' + state +'"}}}';
    logger.log("debug", "payload for shadow update", changePayload);
    var shadowUpdatePayload = {
        payload: changePayload,
        thingName: 'Raspberry_Pi_2'
    };
    logger.log("debug", "shadow update payload", shadowUpdatePayload);
    iotdata.updateThingShadow(shadowUpdatePayload, function(err, data) {
        if (err) {
            logger.log("error", "error updating shadow", err);
        }
        else{// successful response
            logger.log("info", "successfully updated shadow", data);
            responseCreator.sendResponse(res, 200, data);
        }
    });
};

module.exports.getShadow = function (req, res) {
    var iotendpoint = process.env.iotendpoint;
    logger.log("info", "get shadow function");

    var iotdata = new AWS.IotData({endpoint: iotendpoint});
    var params = {
        thingName: 'Raspberry_Pi_2' /* required */
    };
    iotdata.getThingShadow(params, function(err, data) {
        if (err)
            logger.log("error", "error getting shadow", err); // an error occurred
        else {
            var jsonDoc = JSON.parse(data.payload);
            logger.log("info", "successfully retrieved shadow", jsonDoc);
            responseCreator.sendResponse(res, 200, jsonDoc.state);
        }
    });
};