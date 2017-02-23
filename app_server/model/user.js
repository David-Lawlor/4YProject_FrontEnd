var AWS = require("aws-sdk");
var bcrypt = require("bcryptjs");
var database = require("../config/database");

AWS.config.update(database.dbconfig);

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.User = function User(email, password, name) {
    this.email = email;
    this.password = password;
    this.name = name;
};

module.exports.GoogleUser = function User(id, token, displayName, email) {
    this.id = id;
    this.token = token;
    this.displayName = displayName;
    this.email = email;
};

//var User = module.exports = User;

module.exports.createUser = function (newUser, callback) {
    //console.log(newUser);
    var params = {
        TableName: "users",
        Item: {
            "email": newUser.email,
            "password": newUser.password,
            "name": newUser.name
        }
    };
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
};

module.exports.createGoogleUser = function (newUser, callback) {
    //console.log(newUser);
    var params = {
        TableName: "users",
        Item: {
            "id": newUser.id,
            "token": newUser.token,
            "username": newUser.displayName,
            "email": newUser.email
        }
    };

    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err,
                null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
};

module.exports.getUserByEmail = function (emailIn, callback) {
    var params = {
        TableName: "users",
        KeyConditionExpression: "email = :emailIn",
        ExpressionAttributeValues: {
            ":emailIn": emailIn
        }
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
        }
        callback(null, data.Items[0]);
    });

};

module.exports.getUserByGoogleID = function (googleProfileIdIn, callback) {
    var params = {
        TableName: "users",
        KeyConditionExpression: "email = :emailIn",
        ExpressionAttributeValues: {
            ":emailIn": googleProfileIdIn.email
        }
    };
    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
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