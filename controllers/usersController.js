const { db } = require('../config/database')
const Crypto = require('crypto')
const { createToken } = require("../config/token");

module.exports = {
    getData: (req, res) => {
        db.query(`Select * from users;`, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }

            res.status(200).send(results)
        })
    },
    register: (req, res) => {
        let hashpassword = Crypto.createHmac("sha256", "key_password").update(req.body.password).digest("hex")
        let insertScript = `INSERT INTO users values (null,'${req.body.username}','${req.body.email}','${hashpassword}','${req.body.telp}','kurir');`

        db.query(insertScript, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send({ messages: "Register Success ✔", results })
        })
    },
    // login: (req, res) => {
    //     let hashpassword = Crypto.createHmac("sha256", "key_password").update(req.body.password).digest("hex")
    //     let loginScript = `Select * from users WHERE email = '${req.body.email}' AND password = '${hashpassword}';`

    //     db.query(loginScript, (err, results) => {
    //         if (err) {
    //             console.log(err)
    //             res.status(500).send(err)
    //         }
    //         res.status(200).send({ messages: "Login Success", results })
    //     })
    // },
    login: (req, res) => {
        let hashpassword = Crypto.createHmac("sha256", "key_password").update(req.body.password).digest("hex")
        let loginScript = `Select * from users WHERE email = '${req.body.email}' AND password = '${hashpassword}';`

        db.query(loginScript, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            if (results.length > 0) {
                let { idusers, username, email, telp, role } = results[0]
                let token = createToken({ idusers, username, email, telp, role })
                console.log(token)

                res.status(200).send({
                    messages: "Login Success ✅", loginData: {
                        idusers,
                        username,
                        email,
                        telp,
                        role,
                        token
                    }
                })
            } else {
                res.status(401).send({ messages: "User not found ❌" })
            }
        })
    },
    keepLogin: (req, res) => {
        console.log(req.dataUser)
        let loginScript = `Select * from users WHERE idusers=${req.dataUser.idusers} ;`

        db.query(loginScript, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }

            if (results.length > 0) {
                let { idusers, username, email, telp, role,  } = results[0];
                let token = createToken({ idusers, username, email, telp, role });
                res.status(200).send({
                    messages: "Login Success ✅", loginData: {
                        idusers,
                        username,
                        email,
                        telp,
                        role,
                        token
                    }
                });
            } else {
                res.status(401).send({ messages: "User not found ❌" });
            }

        })
    }
}