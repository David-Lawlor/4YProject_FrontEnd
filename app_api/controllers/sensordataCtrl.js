var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();
var moment = require("moment");

module.exports.sensordata = function(req, res) {

    var tempid = '3945a475429ba283aeabd41d4b0d43b7b0c6c0b4';
    console.log("api sensor data called");

    var requestDetails = {"status" : "success", "Room": req.params.location, "sensor": req.params.sensor, "userid": req.params.userId};

    console.log(requestDetails);

    var location = req.params.location;
    var sensor = req.params.sensor;
    var queryTable;
    var tableExtension;
    var sensorAttribute;
    var sensorLocation;

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
        sendResponse(res, 404, []);
    }

    var queryDateMonth = getQueryDate(30);
    var queryDateDay = getQueryDate(1);

    var lambdaPayload = {
        "table": queryTable,
        "tableExt": tableExtension,
        "sensorAttribute": sensorAttribute,
        "sensorLocation": sensorLocation,
        "queryDateMonth": queryDateMonth,
        "queryDateDay": queryDateDay,
        "id": tempid
    };

    console.log(JSON.stringify(lambdaPayload));

    var params = {
        FunctionName: 'DataProcessing', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(lambdaPayload)
    };
    console.log("invoking lambda");
    lambda.invoke(params, function(err, data) {
        if (err) {
            console.log(err);
            sendResponse(res, 404, [])
        } else {
            sendResponse(res, 200, JSON.parse(data.Payload));
        }
    })
};

var sendResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var getQueryDate = function(days){
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