//CRUD setup van Miguel

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
    // res.status(300).redirect('../webserver/info.html')
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
    userDB.getUserFromUserName("Sam").then((user) => {
        res.send(user)
    })
})

app.post('/login', async (req, res) => {
    console.log("Login route called");
    console.log(req.body.userName, req.body.password)
    try {
        if (!req.body.userName || !req.body.password) {
            res.status(400).send('Bad login: Missing username or password! Try again.');
            console.log('Bad login: Missing userName or password! Try again.');
            return;
        }

        userDB.getUserFromUserName(req.body.userName).then((result) => {
            if (result.userName) {
                userDB.checkPassword(req.body.userName, req.body.password).then((verifyPass) => {
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
                console.log(`Account: ${req.body.username} already exists!`)
                res.status(500).send(`Account: ${req.body.username} already exists!`);
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
    userDB.getData("SELECT * FROM images").then((data) => {
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

        userDB.sendData("20222701", "Settings.png").then((response) => {
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

app.get('/data/:userName', async (req, res) => {
    console.log("Data route called")
    console.log("userName", req.params.userName);
    try {
        if (!req.params.userName) {
            res.status(400).send('Bad request: Missing userName.');
            console.log('Bad request: Missing userName.');
            return;
        }

        userDB.getData(req.params.userName).then((data) => {
            console.log("data collected")
            if (data.userName == undefined) {
                res.status(300).send(`No data found for user: ${req.params.userName}`);
            } else if (data.userName) {
                res.status(500).send(data);
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

app.get('/location/:userName', async (req, res) => {
    console.log("Retrieving location");
    console.log(req.params.userName);
    userDB.getLocation(req.params.userName).then((data) => {
        console.log("Retrieved location.")
        res.status(200).send(data)
    })
})

app.post('/location', async (req, res) => {
    console.log("Location route called");
    try {
        if (!req.body.userName || !req.body.location || !req.body.locationName) {
            res.status(400).send('Bad request: Missing username, location or locationName.');
            console.log('Bad request: Missing username, location or locationName.');
            return;
        }

        userDB.checkDuplicateLocations(req.body.userName, req.body.locationName).then((duplicat) => {
            if ((duplicat.userName == undefined) && (duplicat.locationName == undefined)) {
                console.log(duplicat.userName, "check status");
                console.log("New location detected!")

                userDB.sendLocation(`${req.body.userName}`, `${req.body.location}`, `${req.body.locationName}`).then((response) => {
                    console.log(response)
                    if (response) {
                        console.log(response, `Location marker created for ${req.body.locationName}!`)
                        res.status(200).send(`Location ${req.body.locationName} added to database.`);
                    } else if (!response) {
                        console.log("Fool, something went wrong!")
                        res.status(500).send("Fool, something went wrong!");
                    }
                })

            } else {
                console.log(duplicat.userName, "check status");
                console.log("Location already exists")
                res.status(500).send(`Location: ${req.body.locationName} already exists!`);
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



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});