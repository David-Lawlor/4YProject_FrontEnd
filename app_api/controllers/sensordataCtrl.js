var moment = require("moment");
var AWS = require("aws-sdk");

module.exports.sensordata = function(req, res) {
    var tempid = '3945a475429ba283aeabd41d4b0d43b7b0c6c0b4';
    console.log("api sensor data called");

    var requestDetails = {"status" : "success", "Room": req.params.location, "sensor": req.params.sensor, "userid": req.params.userId};
    console.log(requestDetails);

    var queryTable;
    var tableExtension;
    var sensorAttribute;
    var time;
    var sensorlocation;

    if(req.params.location.toUpperCase() === "room1".toUpperCase()){
        sensorlocation = "Room 1";
    }
    else if(req.params.location.toUpperCase() === "room2".toUpperCase()){
        sensorlocation = "Room 2";
    }

    if(req.params.timePeriod.toUpperCase() === "day".toUpperCase()){
        time = 1;
    }
    else if(req.params.timePeriod.toUpperCase() === "fortnight".toUpperCase()){
        time = 14;
    }
    else if(req.params.timePeriod.toUpperCase() === "month".toUpperCase()){
        time = 30;
    }

    if(req.params.sensor.toUpperCase() === "temp".toUpperCase()){
        queryTable = "TemperatureData";
        tableExtension = "temperature";
        sensorAttribute = "Current_Temperature"
    }
    else if(req.params.sensor.toUpperCase() === "light".toUpperCase()){
        queryTable = "LightData";
        tableExtension = "light";
        sensorAttribute = "Current_Temperature"
    }
    else if(req.params.sensor.toUpperCase() === "humid".toUpperCase()){
        queryTable = "HumidityData";
        tableExtension = "humidity";
        sensorAttribute = "Current_Humidity"
    }
    else {
        sendResponse(res, 404, [])
    }

    /*
     Timestamp format required for dynamodb 20170402T000424Z
     Timestamp format output of moment.js 2017-03-14T21:55:50.903Z
     */
    var queryDate = moment().locale('en-ie').subtract(time, 'days').toISOString();

    //remove the dashes and colons from the string
    queryDate = queryDate.replace(/-/g, "").replace(/:/g, "");

    // remove the milliseconds from the timestamp
    queryDate = queryDate.substr(0, (queryDate.length-5)) + "Z";

    var data = [];

    console.log(queryTable);
    console.log(tempid + tableExtension);

    var docClient = new AWS.DynamoDB.DocumentClient();

    var query = {
        TableName: queryTable,
        ProjectionExpression:"#d, #t, #attr , #l",
        KeyConditionExpression: "#pk = :Partition_Key and #ts > :queryDate",
        ExpressionAttributeNames:{
            "#pk": "Partition_Key",
            "#ts": "Timestamp",
            "#d": "Date",
            "#t": "Time",
            "#attr": sensorAttribute,
            "#l": "Location"
        },
        ExpressionAttributeValues: {
            ":Partition_Key": tempid + tableExtension,
            ":queryDate": queryDate
        }
    };

    docClient.query(query, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            var filteredData = [];

            data.Items.forEach(function(item){
                console.log(item);
                if(item.Location == sensorlocation){
                    filteredData.push(item);
                }
            });

            console.log(filteredData);

            var processedData;
            console.log("Query succeeded.");
            if (time == 1){
                processedData = processDataDay(filteredData, sensorAttribute)
            }
            else if(time ==14){
                processedData = processDataFortnight(filteredData, time)
            }
            else if(time ==  30){
                processedData = processDataMonth(filteredData, time)
            }
            sendResponse(res, 200, processedData);
        }
    });


};

var processDataDay =  function(data, sensorAttribute){
    // get the length of the array for the loop
    var arrayLength = data.length;

// create the arrays for the graph data and labels
    var graphData = [];
    var graphLabels = [];

// parse the hour from the first item in the array of objects
    var hour = parseHour(data[0].Time);

// create the graph label
    graphLabels.push(hour + ":00");

// initialise the totals
    var hourTotal = 0;
    var numberOfEntriesForHour = 0;

// loop through each object in the array
    for(var i = 0; i < arrayLength; i++){
        if (hour === parseHour(data[i].Time)) {
            hourTotal += parseFloat(data[i][sensorAttribute]);
            numberOfEntriesForHour++;
            hour = parseHour(data[i].Time);
        }
        else {
            graphData.push(hourTotal / numberOfEntriesForHour);
            hourTotal = parseFloat(data[i][sensorAttribute]);
            numberOfEntriesForHour = 1;
            hour = parseHour(data[i].Time);
            if (hour == 0){
                graphLabels.push(hour + "00:00")
            }
            else {
                graphLabels.push(hour + ":00")
            }
        }

        // at the end of the array the hour will not change again so get average now
        if(i == arrayLength-1){
            graphData.push(hourTotal / numberOfEntriesForHour);
        }
    }

    return  {
        "graphData": graphData,
        "graphLabels": graphLabels
    };
};

var processDataFortnight =  function(data, time){
};

var processDataMonth =  function(data, time){
};


var sendResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var parseHour = function(time){
    return parseInt(time.substring(0, 2));
};
