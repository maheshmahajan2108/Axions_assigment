var db = require('../connection.js')
const { encrypt, decrypt } = require('../helper/encDec.js');
const Str = require('@supercharge/strings')

//  List  all users with token and pagination  
exports.getUsers = (req, callback) => {
    const page = req.query.page
    const limit = req.query.limit
    const startI = (page - 1) * limit
    const endI = page * limit

    // const result = {}

    
    db.raw('SELECT  * FROM  sys.users').then(function (resp) {
        // console.log("**************************", resp[0])


        var result = {}

        result = resp[0].slice(startI, endI)
        callback(null, result)
    });

}

// Function  for  updateUser
exports.updateUser = (req, callback) => {

    console.log("-----------------------------", req.query.id)
    db.raw("UPDATE sys.users SET first_name='" + req.body.first_name + "', last_name='" + req.body.last_name + "', email='" + req.body.email + "', password='" + req.body.password + "' , mobile_no='" + req.body.mobile_no + "' , address='" + req.body.address + "' WHERE id='" + req.query.id + "';").then(function (resp) {
        callback(null, resp[0])
    });

}

// register users  
exports.insertUser = (req, callback) => {

    //Query for check user already exits or not
    try {

        db.raw("SELECT id FROM sys.users where email = '" + req.body.email + "' AND first_name = '" + req.body.first_name + "';").then(function (resp) {

            // ecrypt passwrd using hash
            let pass = encrypt(req.body.password)

            if (resp[0][0] == null) {
                db.raw("INSERT INTO sys.users (first_name, last_name, email, password,mobile_no,address) VALUES('" + req.body.first_name + "', '" + req.body.last_name + "', '" + req.body.email + "', '" + pass + "' , '" + req.body.mobile_no + "' , '" + req.body.address + "');").then(function (resp) {


                    callback(null, resp[0])
                });

            } else {
                callback(null, "user is already exits in system")
            }

        });

    } catch (error) {
        callback(err, "Error Occurred ! during register users")
    }

}

// login  
exports.authenticate = (userDetails, callback) => {


    db.raw("SELECT password FROM sys.users where email = '" + userDetails.email + "';").then(function (resp) {

        if(resp[0][0] != null){
            
        // decrypt passwrd 
        let pass = decrypt(resp[0][0]["password"])

        if (pass == userDetails.password) {
            let tkn = Str.random(50) 
            db.raw("INSERT INTO sys.token(token, email)VALUES('" + tkn + "' , '" + userDetails.email + "');").then(function (resp) {
               callback(null, tkn)

            });

    
        } 
        } else {
            callback(null, "invalid Email and password")
        }
    }
    )
}

// Function  for  searchuser 
exports.searchUsers = (req, callback) => {
    
    const page = req.query.page
    const limit = req.query.limit
    const endI = page * limit
    const startI = (page - 1) * limit
  
    db.raw("SELECT  * FROM  sys.users where first_name = '" + req.body.first_name + "' or last_name = '" + req.body.last_name + "' or email = '" + req.body.email + "'or mobile_no = '" + req.body.mobile_no + "';").then(function (resp) {
      
        var result = {}

        result = resp[0].slice(startI, endI)
        callback(null, result)
    });

}

