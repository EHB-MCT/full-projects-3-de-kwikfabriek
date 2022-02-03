const bcrypt = require('bcryptjs');
const {
    DatabaseFactory
} = require('./databaseFactory');


const {
    User
} = require('./user.js');

const {
    Data
} = require('./data.js');

const {
    Location
} = require('./location.js');


class UserDB {
    getVerbinding() {
        let databaseFactory = new DatabaseFactory();
        return databaseFactory.getDatabase();
    }

    getAll(mijnSqlQuery) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit(mijnSqlQuery).then((resultaat) => {
                let resultatenArray = [];
                resultaat.map((value) => {
                    resultatenArray.push(this.converteerQueryNaarObjectPassword(value));
                });
                resolve(resultatenArray);
            });
        });
    }

    getUserFromUserName(userName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE userName = ?", [userName]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat)
                resolve(resultaat);
            });
        });
    }

    checkPassword(userName, password) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE username = ?", [userName]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat);
                const verifyPass = bcrypt.compareSync(password, resultaat.password);
                resolve(verifyPass);

            });
        });
    }

    checkDuplicates(username) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE username = ?", [username]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat);
                resolve(resultaat);
            });
        });
    }

    checkDuplicateLocations(userName, locationName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM locations WHERE userName = ? and locationName = ?", [userName, locationName]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectLocation(resultaat);
                resolve(resultaat);
            });
        });
    }

    createUser(username, password) {
        return new Promise((resolve, reject) => {
            this.hashPass(password).then(hashedPassword => {
                this.getVerbinding().voerSqlQueryUit("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]).then(() => {
                    this.getUserFromUserName(username).then((value) => {
                        resolve(value);
                    });
                });
            });
        });
    }

    sendData(sampleID, userName, RGB_values, timestamp, locationName, location) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("INSERT INTO data (sampleID, userName, RGB_values, timestamp, locationName, location) VALUES (?,?,?,?,?,?)", [sampleID, userName, RGB_values, timestamp, locationName, location]).then((resultaat) => {
                resolve(resultaat);
            })

        })
    }

    sendLocation(userName, location, locationName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("INSERT INTO locations (userName, location, locationName) VALUES (?,?,?)", [userName, location, locationName]).then((resultaat) => {
                resolve(resultaat);
            })

        })
    }

    getData(userName) {
        console.log(userName);
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM data WHERE userName = ?", [userName]).then((resultaat) => {
                // resultaat = this.converteerQueryNaarObject(resultaat);
                resolve(resultaat);
            });
        });
    }

    getLocation(userName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM locations WHERE userName = ?", [userName]).then((resultaat) => {
                resolve(resultaat);
                console.log(resultaat);
            });
        });
    }

    getSpecificLocation(userName, locationName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM locations WHERE userName = ? and locationName = ?", [userName, locationName]).then((resultaat) => {
                resolve(resultaat);
                console.log("resultaat", resultaat);
            });
        });
    }

    hashPass(password) {
        return new Promise((resolve, reject) => {
            const hashedPassword = bcrypt.hash(password, 10);
            resolve(hashedPassword);
        })
    }

    deleteLocation(userName, locationName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("DELETE FROM locations WHERE userName = ? and locationName = ?", [userName, locationName]).then((resultaat) => {
                // resultaat = this.converteerQueryNaarObjectData(resultaat);
                resolve(resultaat);
                console.log(resultaat);
            });
        });
    }

    converteerQueryNaarObject(query) {
        return new User(query.id, query.userName, query.password);
    }

    converteerQueryNaarObjectPassword(query) {
        return new User(query.userName, query.password);
    }

    converteerQueryNaarObjectData(query) {
        return new Data(query.userName, query.sampleID, query.RGB_values);
    }

    converteerQueryNaarObjectLocation(query) {
        return new Location(query.userName, query.location, query.locationName);
    }
}

exports.UserDB = UserDB;