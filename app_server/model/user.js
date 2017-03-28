var AWS = require("aws-sdk");
var bcrypt = require("bcryptjs");
var database = require("../config/database");

AWS.config.update(database.dbconfig);

var docClient = new AWS.DynamoDB.DocumentClient();


// user definition
module.exports.User = function User(email, password, name, mac) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.mac = mac;
};


// Google user object
module.exports.GoogleUser = function User(id, token, displayName, email) {
    this.id = id;
    this.token = token;
    this.displayName = displayName;
    this.email = email;
};


// create the user
module.exports.createUser = function (newUser, callback) {

    var usersearch = {
        TableName: "Users",
        KeyConditionExpression: "email = :emailIn",
        ExpressionAttributeValues: {
            ":emailIn": newUser.email
        }
    };

    userExists(usersearch, function (existingUser) {
        console.log("gjgyu " + existingUser);
        console.log(existingUser);

        console.log("existing: " + existingUser);
        if (!existingUser) {
            var params = {
                TableName: "Users",
                Item: {
                    "email": newUser.email,
                    "password": newUser.password,
                    "name": newUser.name,
                    "mac": newUser.mac
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
        }
        else {
            callback(new Error("User already exists"));
        }
    });


};


// create a google user
module.exports.createGoogleUser = function (newUser, callback) {
    //console.log(newUser);
    var params = {
        TableName: "Users",
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
            console.log("Query succeeded.");
        }
        callback(null, data.Items[0]);
    });

};

module.exports.getUserByGoogleID = function (googleProfileIdIn, callback) {
    var params = {
        TableName: "Users",
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
