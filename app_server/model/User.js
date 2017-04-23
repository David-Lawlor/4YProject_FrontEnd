var AWS = require("aws-sdk");
var bcrypt = require("bcryptjs");
var database = require("../config/DatabaseConfig");
var crypto = require("crypto");
var logger = require('winston');

AWS.config.update(database.dbconfig);

var docClient = new AWS.DynamoDB.DocumentClient();


// user definition
module.exports.User = function User(email, password, firstName, lastName, mac) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.mac = mac;
};


// create the user
module.exports.createUser = function (newUser, callback) {

    var userSearch = {
        TableName: "Users",
        KeyConditionExpression: "email = :emailIn",
        ExpressionAttributeValues: {
            ":emailIn": newUser.email
        }
    };

    userExists(userSearch, function (existingUser) {
        if (!existingUser) {
            var shasum = crypto.createHash('sha1');
            var id = shasum.update(newUser.mac).digest("hex");
            console.log(id);
            var params = {
                TableName: "Users",
                Item: {
                    "email": newUser.email,
                    "password": newUser.password,
                    "firstName": newUser.firstName,
                    "lastName": newUser.lastName,
                    "mac": newUser.mac,
                    "id": id
                }
            };

            // encrypt the password
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(params.Item.password, salt, function (err, hash) {
                    params.Item.password = hash;
                    docClient.put(params, function (err, data) {
                        if (err) {
                            console.error("Unable to add item. Error JSON:", JSON.stringify(err,
                                null, 2));
                        } else {
                            console.log("Added item:", JSON.stringify(data, null, 2));
                        }
                    });
                });
            });
            callback(null);
        }
        else {
            callback(new Error("User already exists"));
        }
    });


};

module.exports.getUserByEmail = function (emailIn, callback) {
    var params = {
        TableName: "Users",
        KeyConditionExpression: "email = :emailIn",
        ExpressionAttributeValues: {
            ":emailIn": emailIn
        }
    };


    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            logger.log("info", "Query succeeded.");
        }
        callback(null, data.Items[0]);
    });
};

module.exports.comparePassword = function (passwordIn, hash, callback) {
    bcrypt.compare(passwordIn, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

function userExists(userSearch, callback) {
    docClient.query(userSearch, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
        }
        console.log("1");
        console.log(data.Items[0]);
        if(data.Items[0]){
            console.log("2");
            callback(data.Items[0].email);
        }
        else{
            console.log("3");
            callback();
        }
    });
}
