var request = require('request');
var moment = require("moment");
var crypto = require("crypto-js");
var AWS = require("aws-sdk");

module.exports.interact = function(req, res) {
    /*
     Timestamp format required for dynamodb 20170402T000424Z
     Timestamp format output of moment.js 2017-03-14T21:55:50.903Z
     */
    var queryDate = moment().locale('en-ie').toISOString();

    //remove the dashes and colons from the string
    queryDate = queryDate.replace(/-/g, "").replace(/:/g, "");

    // remove the milliseconds from the timestamp
    queryDate = queryDate.substr(0, (queryDate.length-5)) + "Z";



    var iotendpoint = process.env.iotendpoint;
    var region = process.env.AWS_REGION;
    var service = 'iotdata';
    var AccessKey = process.env.AWS_ACCESS_KEY_ID;
    var SecretKey = process.env.AWS_SECRET_ACCESS_KEY;
    var host = iotendpoint.substr(8, iotendpoint.length);
    var datestamp = queryDate.substr(0, 8);

    console.log(iotendpoint);
    console.log(region);
    console.log(service);
    console.log(AccessKey);
    console.log(SecretKey);
    console.log(datestamp);
    console.log(host);
    //console.log(signature);

    console.log("ok");

    var iotdata = new AWS.IotData({endpoint: iotendpoint});
    // var params = {
    //     thingName: 'Raspberry_Pi_2' /* required */
    // };
    // iotdata.getThingShadow(params, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else {
    //         var jsonDoc = JSON.parse(data.payload);
    //         sendResponse(res, 200, jsonDoc.state);
    //     }
    // });
    var params = {
        payload: '{"state": {"desired": {"relay4": "OFF"}}}', /* required */
        thingName: 'Raspberry_Pi_2' /* required */
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


var sendResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};