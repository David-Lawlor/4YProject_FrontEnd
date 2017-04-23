var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();
var moment = require("moment");
var logger = require('winston');
var responseCreator = require('./ResponseCreator');

module.exports.sensordata = function(req, res) {
    logger.log('info', "api sensor data called", {"Room": req.params.location, "sensor": req.params.sensor});

    var location = req.params.location;
    var sensor = req.params.sensor;
    var queryTable;
    var tableExtension;
    var sensorAttribute;
    var sensorLocation;
    var userid = req.params.userId;

    if(location.toUpperCase() === "room1".toUpperCase()){
        sensorLocation = "Room 1";
    }
    else if(location.toUpperCase() === "room2".toUpperCase()){
        sensorLocation = "Room 2";
    }

    if(sensor.toUpperCase() === "temp".toUpperCase()){
        queryTable = "TemperatureData";
        tableExtension = "temperature";
        sensorAttribute = "Current_Temperature";
    }
    else if(sensor.toUpperCase() === "light".toUpperCase()){
        queryTable = "LightData";
        tableExtension = "light";
        sensorAttribute = "Current_Temperature";
    }
    else if(sensor.toUpperCase() === "humid".toUpperCase()){
        queryTable = "HumidityData";
        tableExtension = "humidity";
        sensorAttribute = "Current_Humidity";
    }
    else {
        responseCreator.sendResponse(res, 404, []);
    }

    var queryDateMonth = exports.getQueryDate(30);
    var queryDateDay = exports.getQueryDate(1);

    var lambdaPayload = {
        "table": queryTable,
        "tableExt": tableExtension,
        "sensorAttribute": sensorAttribute,
        "sensorLocation": sensorLocation,
        "queryDateMonth": queryDateMonth,
        "queryDateDay": queryDateDay,
        "id": userid
    };

    logger.log('info', "lambda query payload", {
        "table": queryTable,
        "tableExt": tableExtension,
        "sensorAttribute": sensorAttribute,
        "sensorLocation": sensorLocation,
        "queryDateMonth": queryDateMonth,
        "queryDateDay": queryDateDay});

    var params = {
        FunctionName: 'DataProcessing', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(lambdaPayload)
    };
    logger.log('info', "invoking lambda");
    lambda.invoke(params, function(err, data) {
        if (err) {
            logger.error('error', err);
            responseCreator.sendResponse(res, 404, [])
        } else {
            logger.log('info', "sending response from lambda");
            responseCreator.sendResponse(res, 200, JSON.parse(data.Payload));
        }
    })
};

module.exports.getQueryDate = function(days){
    /*
     Timestamp format required for dynamodb 20170402T000424Z
     Timestamp format output of moment.js 2017-03-14T21:55:50.903Z
     */
    var queryDate = moment().locale('en-ie').subtract(days, 'days').toISOString();

    //remove the dashes and colons from the string
    queryDate = queryDate.replace(/-/g, "").replace(/:/g, "");

    // remove the milliseconds from the timestamp
    queryDate = queryDate.substr(0, (queryDate.length-5)) + "Z";

    return queryDate;
};