var request = require('request');
var moment = require("moment");
var crypto = require("crypto-js");
var AWS = require("aws-sdk");

module.exports.updateShadow = function(req, res) {
    var iotendpoint = process.env.iotendpoint;
    var relay = req.body.relay;
    var state = req.body.state;

    console.log(relay);
    console.log(typeof relay);

    console.log(state);
    console.log(typeof state);
    console.log(state != 'ON' );
    console.log(state != 'OFF');
    console.log("update shadow");

    if((state != 'ON' && state != 'OFF') || isNaN(relay)){
        return sendResponse(res, 404, []);
    }

    console.log(req.body.relay);
    console.log(req.body.state);
    console.log("update shadow");

    var iotdata = new AWS.IotData({endpoint: iotendpoint});

    var changePayload = '{"state": {"desired": {"relay' + (relay) + '": "' + state +'"}}}';
    console.log(changePayload);
    var params = {
        payload: changePayload,
        thingName: 'Raspberry_Pi_2'
    };
    iotdata.updateThingShadow(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
            console.log(data);           // successful response
            //var jsonDoc = JSON.parse(data.payload);
            sendResponse(res, 200, data);
        }
    });
};

module.exports.getShadow = function (req, res) {
    var iotendpoint = process.env.iotendpoint;
    console.log("get shadow");

    var iotdata = new AWS.IotData({endpoint: iotendpoint});
    var params = {
        thingName: 'Raspberry_Pi_2' /* required */
    };
    iotdata.getThingShadow(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            var jsonDoc = JSON.parse(data.payload);
            sendResponse(res, 200, jsonDoc.state);
        }
    });
};




var sendResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};