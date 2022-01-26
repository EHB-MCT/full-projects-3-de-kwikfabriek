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
    console.log("Mainpage")
    res.status(200).send({
        message: "Server Biolab",
    });
})

app.get('/users', async (req, res) => {
    console.log("All users");
    userDB.getAll("SELECT * FROM users").then((users) => {
        res.send(users)
    })
})

app.post('/login', async (req, res) => {
    console.log("Login route called");
    try {
        if (!req.body.username || !req.body.password) {
            res.status(400).send('Bad login: Missing email or password! Try again.');
            return;
        }
        userDB.checkPassword(req.body.username, req.body.password).then((verifyPass) => {
            if (verifyPass) {
                console.log("You are logged in, have fun!")
                res.status(200).send("You are logged in, have fun!");
            } else if (!verifyPass) {
                console.log("Fool, wrong password or username!")
                res.status(500).send("Fool, wrong password or username!");
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
            return;
        }

        userDB.checkDuplicates(req.body.name).then((result) => {
            if (result) {
                return;
            }
        })

        userDB.createUser(req.body.username, req.body.password).then((result) => {
            console.log(result, "this is result");
            if (result) {
                console.log("You are logged in, have fun!")
                res.status(200).send("Acount created!");
            } else if (!result) {
                console.log("Fool, wrong password or username!")
                res.status(500).send("Fool, wrong password or username!");
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

app.get('/user', async (req, res) => {
    console.log("One user")
    userDB.getUserFromUserID("1").then((user) => {
        res.send(user)
    })
})



app.get('/connection', async (req, res) => {
    dataBase.maakVerbindingMetDatabase();
    res.status(200).send("Succesfull connection.")
})


app.post('/addUser', async (req, res) => {
    console.log("Add user path")
    try {
        if (!req.body.username || !req.body.password) {
            res.status(400).send('Bad Register: Missing username or password! Try again.');
            return;
        }
        var QUERY = `INSERT INTO users(username, password) VALUES ("${req.body.username}", "${req.body.password}" )`
        dataBase.voerSqlQueryUit(QUERY).then((data) => {
            res.status(201).send(data)
        })
    } catch (error) {
        console.log(error, "Sending doesn't work")

    } finally {
        console.log("User added to BioLab server.")
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});