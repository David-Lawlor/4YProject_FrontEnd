var AWS = require("aws-sdk");
var bcrypt = require("bcryptjs");

AWS.config.update({
    region : "eu-west-1",
    endpoint : "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

function User(username, email, password, name) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.name = name;
}

var User = module.exports = User;

module.exports.createUser = function(newUser, callback)
{
    //console.log(newUser);
    var params = {
        TableName : "users",
        Item : {
            "username" : newUser.username,
            "email" : newUser.email,
            "password" : newUser.password,
            "name" : newUser.name
        }
    };
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(params.Item.password, salt, function(err, hash) {
            params.Item.password = hash;
            docClient.put(params, function(err, data) {
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

module.exports.getUserByUsername = function(usernameIn, callback){
    var params = {
        TableName : "users",
        KeyConditionExpression: "username = :usernameIn",
        ExpressionAttributeValues: {
            ":usernameIn": usernameIn
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
        }
        callback(null, data.Items[0]);
    });

};

module.exports.comparePassword = function(passwordIn, hash, callback){
    bcrypt.compare(passwordIn, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
};