//CRUD setup van Miguel
var mysql = require('mysql');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8100;
const cors = require('cors');

const {
    Database
} = require('./CRUD/database.js');

const {
    UserDB
} = require('./CRUD/UserDB.js');

let userDB = new UserDB;
let dataBase = new Database;


app.use(bodyParser.json());
app.use(cors());


app.get('/', async (req, res) => {
    // res.status(300).redirect("./public/info.html")
    res.status(200).send("Welcome to the BioLab server.")
    console.log("Documentation page")
})

app.get('/users', async (req, res) => {
    console.log("All users");
    userDB.getAll("SELECT * FROM users").then((users) => {
        res.send(users)
    })
})

app.get('/user', async (req, res) => {
    console.log("One user")
    userDB.getUserFromUserID("1").then((user) => {
        res.send(user)
    })
})


app.post('/login', async (req, res) => {
    console.log("Login route called");
    try {
        if (!req.body.username || !req.body.password) {
            res.status(400).send('Bad login: Missing email or password! Try again.');
            console.log('Bad login: Missing email or password! Try again.');
            return;
        }

        userDB.getUserFromUserName(req.body.username).then((result) => {
            if (result.userName) {
                userDB.checkPassword(req.body.username, req.body.password).then((verifyPass) => {
                    if (verifyPass) {
                        console.log("You are logged in, have fun!")
                        res.status(200).send("You are logged in, have fun!");
                    } else if (!verifyPass) {
                        console.log("Fool, wrong password or username!")
                        res.status(500).send("Fool, wrong password or username!");
                    }
                })

            } else if (result.userName == undefined) {
                console.log("User doesn't exicsts!")
                res.status(501).send("Fool, now user found in database!");
                return;
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        })
    }

})

app.post('/register', async (req, res) => {
    console.log("Register route called");
    try {
        if (!req.body.username || !req.body.password) {
            res.status(400).send('Bad login: Missing email or password! Try again.');
            console.log('Bad login: Missing email or password! Try again.');
            return;
        }

        userDB.checkDuplicates(req.body.username, req.body.password).then((duplicat) => {
            if (duplicat.userName == undefined) {
                console.log(duplicat.userName, "check status");
                console.log("New account detected!")
                userDB.createUser(req.body.username, req.body.password).then((result) => {
                    console.log(result, "this is result");
                    if (result) {
                        console.log("Acount created!")
                        res.status(200).send("Acount created!");
                    } else if (!result) {
                        console.log("Fool, wrong password or username!")
                        res.status(500).send("Fool, wrong password or username!");
                    }
                })
            } else {
                console.log(duplicat.userName, "check status");
                console.log("Account already excists!")
                res.status(500).send("Account already excists!");
                return;
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        })
    } finally {
        console.log("Query succesfull!")
    }
})

app.get('/imageData', async (req, res) => {
    console.log("All images")
    userDB.getAllImageData("SELECT * FROM images").then((data) => {
        res.send(data)
    })
})

app.get('/connection', async (req, res) => {
    dataBase.maakVerbindingMetDatabase();
    res.status(200).send("Succesfull connection.");
})


app.post('/data', async (req, res) => {
    console.log("Data route called");
    try {
        if (!req.body.sampleID || !req.body.link) {
            res.status(400).send('Bad request: Missing sampleID or link to image file.');
            console.log('Bad request: Missing sampleID or link to image file.');
            return;
        }

        userDB.sendData("20222701", "../assets/Settings.png").then((response) => {
            res.send(response);
            console.log("Data transmitted and confirmation.")
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        })
    } finally {
        console.log("Query succesfull!")
    }

})

app.get('/data', async (req, res) => {
    console.log("Data route called")
    try {
        // if (!req.body.sampleID) {
        //     res.status(400).send('Bad request: Missing sampleID.');
        //     console.log('Bad request: Missing sampleID.');
        //     return;
        // }

        userDB.getData("20222701").then((data) => {
            console.log("data collected")
            res.status(200).send(data);
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        })
    } finally {
        console.log("Query succesfull!")
    }



})







app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});