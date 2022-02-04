//CRUD setup van Miguel

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))

const {
    Database
} = require('./CRUD/database.js');

const {
    UserDB
} = require('./CRUD/UserDB.js');

let userDB = new UserDB;
let dataBase = new Database;

// function verifyUser(req, res, next) {
//     console.log("Verification route called");
//     try {
//         if (!req.body.user.email || !req.body.user.password) {
//             res.status(400).send('Bad login: Missing username or password! Try again.');
//             console.log('Bad login: Missing userName or password! Try again.');
//             return;
//         }

//         userDB.getUserFromUserName(req.body.user.email).then((result) => {
//             if (result.userName) {
//                 userDB.checkPassword(req.body.user.email, req.body.user.password).then((verifyPass) => {
//                     if (verifyPass) {
//                         console.log(`You are logged in ${req.body.user.email}, have fun!`)
//                         res.status(200).send(`You are logged in ${req.body.user.email}, have fun!`);
//                     } else if (!verifyPass) {
//                         console.log("Fool, wrong password or username!")
//                         res.status(500).send("Password");
//                     }
//                 })
//             } else if (result.userName == undefined) {
//                 console.log(`User ${req.body.user.email} doesn't exists!`)
//                 res.status(501).send(`Account`);
//                 return;
//             }
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             error: 'Something went wrong with the query.',
//             value: error
//         })
//     }
//     next();
// }


/**
 * Middleware om te kijken als de user ingelogd is
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let authUser = (req, res, next) => {
    let user = req.body.user;
    userDB.getUserFromUserName(req.body.user.email).then((result) => {
        if(result){
            userDB.checkPassword(req.body.user.email, req.body.user.password).then((result) => {
                if(result){
                    next();
                }else{
                    res.status(500).send('wrong password');
                }
            });
        }else{
            res.status(500).send('user not found');
        }
    });
}


app.post('/test', authUser, (req, res) => {

    console.log('TEST', req.body.data.param1, req.body.data.param2);

    res.status(200).send({
        status: 'ok',
        data: 'Hello world!'
    });

});




app.get('/users', async (req, res) => {
    console.log("All users called.");
    userDB.getAll("SELECT * FROM users").then((users) => {
        res.status(200).send(users)
    })
})

app.get('/user/:userName', async (req, res) => {
    console.log("One user called.")
    userDB.getUserFromUserName(req.params.userName).then((user) => {
        res.status(200).send(user)
    })
})

app.get('/connection', async (req, res) => {
    console.log("Connection route called.")
    dataBase.maakVerbindingMetDatabase();
    res.status(200).send("Succesfull connection.");
})

app.get('/location', async (req, res) => {
    console.log(`Retrieving locations from user:${req.body.userName}`);
    userDB.getLocation(req.body.userName).then((data) => {
        console.log(`Retrieved locations for user: ${req.body.userName}`)
        res.status(200).send(data)
    })
})

app.post('/data', async (req, res) => {
    console.log("Data route called");
    try {
        if (!req.body.data) {
            res.status(400).send('Bad request: Missing userName.');
            console.log('Bad request: Missing userName.');
            return;
        }
        userDB.getData(req.body.data).then((data) => {
            console.log("Username:", data.userName)
            if (!data.userName) {
                res.status(300).send(`No data found for user: ${req.body.data.userName}`);
            } else if (data.userName) {
                res.status(200).send(data);
                console.log(data);
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

app.post('/login', async (req, res) => {
    console.log("credentials:", req.body.user.email, req.body.user.password);
    console.log("Login route called");
    try {
        if (!req.body.user.email || !req.body.user.password) {
            res.status(400).send('Bad login: Missing username or password! Try again.');
            console.log('Bad login: Missing userName or password! Try again.');
            return;
        }

        userDB.getUserFromUserName(req.body.user.email).then((result) => {
            if (result.userName) {
                userDB.checkPassword(req.body.user.email, req.body.user.password).then((verifyPass) => {
                    if (verifyPass) {
                        console.log(`You are logged in ${req.body.user.email}, have fun!`)
                        res.status(200).send(`You are logged in ${req.body.user.email}, have fun!`);
                    } else if (!verifyPass) {
                        console.log("Fool, wrong password or username!")
                        res.status(500).send("Password");
                    }
                })
            } else if (result.userName == undefined) {
                console.log(`User ${req.body.user.email} doesn't exists!`)
                res.status(501).send(`Account`);
                return;
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong with the query.',
            value: error
        })
    }

})

app.post('/register', async (req, res) => {
    console.log("Register route called");
    try {
        if (!req.body.user.email || !req.body.user.password) {
            res.status(400).send('Bad registration: Missing username or password! Try again.');
            console.log('Bad registration: Missing username or password! Try again.');
            return;
        }

        userDB.checkDuplicates(req.body.user.email, req.body.user.password).then((duplicat) => {
            if (duplicat.userName == undefined) {
                console.log("New account detected!")
                userDB.createUser(req.body.user.email, req.body.user.password).then((result) => {
                    if (result) {
                        console.log(`Account created with name: ${req.body.user.email} !`)
                        res.status(200).send(`Account created with name:${req.body.user.email}!`);
                    } else if (!result) {
                        console.log("Fool, wrong password or username!")
                        res.status(500).send("Password");
                    }
                })
            } else {
                console.log(`Account: ${req.body.user.email} already exists!`)
                res.status(500).send(`Account`);
                return;
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong with the query.',
            value: error
        })
    } finally {
        console.log("Query succesfull!")
    }
})


//Functions with verification middleware (/verification adding in route)
app.post('/data', async (req, res) => {
    console.log("Data route called");
    try {
        if (!req.body.sampleID || !req.body.userName || !req.body.RGB_values || !req.body.locationName || !req.body.location) {
            res.status(400).send('Bad request: Missing sampleID, userName, RGB_values, missing locationName or location!');
            console.log('Bad request: Missing sampleID, userName or RGB_values of image file.');
            return;
        }

        userDB.sendData(req.body.sampleID, req.body.userName, req.body.RGB_values, req.body.timestamp, req.body.locationName, req.body.location).then((response) => {
            res.send(response);
            console.log(response);
            console.log("Data transmitted and confirmation.")
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error,
            value: 'Something went wrong'
        })
    } finally {
        console.log("Query succesfull!")
    }

})

app.post('/location', async (req, res) => {
    console.log("Location route called");
    try {
        if (!req.body.userName || !req.body.locationName) {
            res.status(400).send('Bad request: Missing username, location or locationName.');
            console.log('Bad request: Missing username, location or locationName.');
            return;
        }

        userDB.checkDuplicateLocations(req.body.userName, req.body.locationName).then((duplicat) => {
            if ((duplicat.userName == undefined) || (duplicat.locationName == undefined) || (duplicat.location == undefined)) {
                console.log("New location detected!")
                userDB.sendLocation(`${req.body.userName}`, `${req.body.location}`, `${req.body.locationName}`).then((response) => {
                    if (response) {
                        console.log(`Location marker created for ${req.body.locationName}!`)
                        res.status(200).send(`Location marker for:${req.body.locationName} added to database.`);
                    } else if (!response) {
                        console.log("Fool, something went wrong!")
                        res.status(500).send("Fool, something went wrong!");
                    }
                })

            } else {
                console.log(`Location already exists with name:${req.body.locationName}`)
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

app.delete('/location/delete', async (req, res) => {
    console.log("Location delete route called");
    try {
        if (!req.body.userName || !req.body.locationName) {
            res.status(400).send('Bad request: Missing username or locationName.');
            console.log('Bad request: Missing username or locationName.');
            return;
        }

        userDB.getSpecificLocation(req.body.userName, req.body.locationName).then((data) => {
            if (data.length === 0) {
                res.status(400).send(`No location found with name:${req.body.locationName}`);
                console.log(`No location found with name:${req.body.locationName}`)
                return;
            } else if (!(data.length === 0)) {
                userDB.deleteLocation(req.body.userName, req.body.locationName).then((data) => {
                    res.status(201).send(`Location: ${req.body.locationName} removed from data base`);
                    console.log(`Location: ${req.body.locationName} removed from data base`, data);
                })
            }
        });
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