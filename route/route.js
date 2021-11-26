
const { json } = require('express');
var controller = require('../Controller/controller.js');
const { encrypt, decrypt } = require('../helper/encDec.js');
var db = require('../connection.js')





module.exports = (app) => {
    var tkn
    db.raw('SELECT  token FROM  sys.token ORDER BY id DESC LIMIT 1').then(function (resp) {

        tkn = resp[0][0]['token']
        // console.log("**************************",tkn)    
    })




    app.post('/getUsers', function (req, res, next) {

        if (req.headers.token == tkn) {
            controller.getUsers(req, (err, resp) => {

                if (err) {

                    res.status(500).send({
                        status: false,
                        data: [],
                        code: 500,
                        errors: [],
                        message: "Error occurred ! "
                    })
                } else {
                    res.status(200).send({
                        status: true,
                        data: resp,
                        message: "success"
                    })
                }
            })
        } else {
            res.status(500).send({
                status: false,
                data: [],
                code: 500,
                errors: [],
                message: "Invalid token ! "
            })
        }

    });

    app.post('/searchUsers', function (req, res, next) {

        if (req.headers.token == tkn) {
            controller.searchUsers(req, (err, resp) => {
                if (err) {

                    res.status(500).send({
                        status: false,
                        data: [],
                        code: 500,
                        errors: [],
                        message: "Error occurred ! "
                    })
                } else {
                    res.status(200).send({
                        status: true,
                        data: resp,
                        message: "success"
                    })
                }
            })
        } else {
            res.status(500).send({
                status: false,
                data: [],
                code: 500,
                errors: [],
                message: "Invalid token ! "
            })
        }

    });

    app.post('/updateUser', function (req, res, next) {

        if (req.headers.token == tkn) {
            controller.updateUser(req, (err, resp) => {
                if (err) {

                    res.status(500).send({
                        status: false,
                        code: 500,
                        errors: [],
                        message: "Error occurred ! "
                    })
                } else {
                    res.status(200).send({
                        status: true,
                        data: resp,
                        message: "User successfully update"
                    })
                }
            })
        } else {
            res.status(500).send({
                status: false,
                data: [],
                code: 500,
                errors: [],
                message: "Invalid token ! "
            })
        }


    });

    app.post('/login', (req, res) => {
        if (typeof req.body.email != 'undefined' && req.body.email != '' && typeof req.body.password != 'undefined' && req.body.password != '') {

            controller.authenticate(req.body, (err, resp) => {
                if (err) {
                    sendErrorResponse(res, "Error while authorizing user.", err)
                } else if (resp) {

                    res.status(200).send({
                        status: true,
                        code: 201,
                        token: resp
                    })

                } else {
                    res.status(200).send({
                        status: true,
                        code: 201,
                        errors: [],
                        message: resp
                    })
                }
            })
        } else {
            res.status(200).send({
                status: false,
                data: [],
                code: 400,
                errors: [],
                message: "Bad Request. Please try again or contact administrator."
            })
        }
    })

    app.post('/register', (req, res) => {
        controller.insertUser(req, (err, resp) => {
            if (err) {

                res.status(500).send({
                    status: false,
                    data: [],
                    code: 500,
                    errors: [],
                    message: "Error occurred ! "
                })
            } else {
                res.status(200).send({
                    status: true,
                    data: resp,
                    message: "user inserted successfuly"
                })
            }
        })

    })

}