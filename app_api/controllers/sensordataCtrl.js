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
    var sensorLocation;

    if(req.params.location.toUpperCase() === "room1".toUpperCase()){
        sensorLocation = "Room 1";
    }
    else if(req.params.location.toUpperCase() === "room2".toUpperCase()){
        sensorLocation = "Room 2";
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

    var queryDateMonth = getQueryDate(30);
    var queryDateDay = getQueryDate(1);

    var data = [];

    console.log(queryTable);
    console.log(tempid + tableExtension);

    var docClient = new AWS.DynamoDB.DocumentClient();

    var monthQuery = createQuery(queryDateMonth, queryTable, tableExtension, sensorAttribute, tempid);
    var dayQuery = createQuery(queryDateDay, queryTable, tableExtension, sensorAttribute, tempid);



    docClient.query(dayQuery, function(err, dayData) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            var filteredData = filterByLocation(dayData, sensorLocation);
            console.log("Query succeeded.");
            var currentTemperature = filteredData[filteredData.length -1];
            var processedDayData = processDataDay(filteredData, sensorAttribute);

            docClient.query(monthQuery, function(err, monthData) {
                if (err) {
                    console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
                } else {
                    var filteredData = filterByLocation(monthData, sensorLocation);
                    //console.log(filteredData);
                    console.log("Query succeeded.");
                    var processMonthData = processDataMonth(filteredData, sensorAttribute);
                    var returnData = {
                        Day: processedDayData,
                        Month: processMonthData,
                        CurrentReading: currentTemperature
                    };
                    sendResponse(res, 200, returnData);
                }
            });
        }
    });


};

var processDataDay =  function(data, sensorAttribute){
    console.log("processing data by day");

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
            graphData.push(Math.round((hourTotal / numberOfEntriesForHour)*100)/100);
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
            graphData.push(Math.round((hourTotal / numberOfEntriesForHour)*100)/100);
        }
    }

    return  {
        "graphData": graphData,
        "graphLabels": graphLabels
    };
};

var processDataMonth =  function(data, sensorAttribute){
    console.log("processing data by day");

    // get the length of the array for the loop
    var arrayLength = data.length;

// create the arrays for the graph data and labels
    var graphData = [];
    var graphLabels = [];

    // parse the hour from the first item in the array of objects
    var day = parseDay(data[0].Date);

    // create the graph label
    graphLabels.push(data[0].Date);

    // initialise the totals
    var dayTotal = 0;
    var numberOfEntriesForDay = 0;

    // loop through each object in the array
    for(var i = 0; i < arrayLength; i++){
        if (day === parseDay(data[i].Date)) {
            dayTotal += parseFloat(data[i][sensorAttribute]);
            numberOfEntriesForDay++;
            day = parseDay(data[i].Date);
        }
        else {
            graphData.push(Math.round((dayTotal / numberOfEntriesForDay)*100)/100);
            dayTotal = parseFloat(data[i][sensorAttribute]);
            numberOfEntriesForDay = 1;
            day = parseDay(data[i].Date);
            graphLabels.push(data[i].Date);
        }
        // at the end of the array the hour will not change again so get average now
        if(i == arrayLength-1){
            graphData.push(Math.round((dayTotal / numberOfEntriesForDay)*100)/100);
        }
    }

    return  {
        "graphData": graphData,
        "graphLabels": graphLabels
    };
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

var filterByLocation = function(data, sensorLocation){
    var filteredData = [];
    data.Items.forEach(function(item){
        //console.log(item);
        if(item.Location == sensorLocation){
            filteredData.push(item);
        }
    });
    return filteredData;
};

var createQuery = function (queryDate, queryTable, tableExtension, sensorAttribute, tempid) {
    return {
        TableName: queryTable,
        ProjectionExpression: "#d, #t, #attr , #l",
        KeyConditionExpression: "#pk = :Partition_Key and #ts > :queryDate",
        ExpressionAttributeNames: {
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
};


var parseHour = function(time){
    return parseInt(time.substring(0, 2));
};

var parseDay = function(date){
    return parseInt(date.substring(0, 2));
};

var parseMonth = function(date){
    return parseInt(date.substring(3, 5));
};

var parseYear = function(date){
    return parseInt(date.substring(6, 10));
};


