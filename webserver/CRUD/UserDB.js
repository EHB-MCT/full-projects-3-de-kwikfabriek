const bcrypt = require('bcryptjs');
const {
    DatabaseFactory
} = require('./databaseFactory');


const {
    User
} = require('./user.js');

const {
    Image
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
                    resultatenArray.push(this.converteerQueryNaarObject(value));
                });
                resolve(resultatenArray);
                console.log(resultatenArray);
            });
        });
    }

    getUserFromUserName(userName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE userName = ?", [userName]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat)
                resolve(resultaat);
                console.log(resultaat);
            });
        });
    }

    checkPassword(userName, password) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE username = ?", [userName]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat);
                console.log(resultaat);
                const verifyPass = bcrypt.compareSync(password, resultaat.password);
                console.log(verifyPass);
                resolve(verifyPass);

            });
        });
    }

    checkDuplicates(username) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE username = ?", [username]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat);
                console.log(resultaat, "check duplicates");
                resolve(resultaat);
            });
        });
    }

    checkDuplicateLocations(userName, locationName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM locations WHERE userName = ? and locationName = ?", [userName, locationName]).then((resultaat) => {
                console.log('Username:', userName);
                console.log('LocationName:', locationName)
                resultaat = this.converteerQueryNaarObjectLocation(resultaat);
                console.log(resultaat, "Checking for duplicates.");
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

    sendData(sampleID, link) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("INSERT INTO data (sampleID, fileURL) VALUES (?,?)", [sampleID, link]).then((resultaat) => {
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
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM data WHERE userName = ?", [userName]).then((resultaat) => {
                // resultaat = this.converteerQueryNaarObjectData(resultaat);
                resolve(resultaat);
                console.log(resultaat);
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

    hashPass(password) {
        return new Promise((resolve, reject) => {
            const hashedPassword = bcrypt.hash(password, 10);
            resolve(hashedPassword);
        })
    }

    converteerQueryNaarObject(query) {
        return new User(query.id, query.userName, query.password);
    }

    converteerQueryNaarObjectPassword(query) {
        return new User(query.userName, query.password);
    }

    converteerQueryNaarObjectData(query) {
        return new Image(query.sampleID, query.fileURL);
    }

    converteerQueryNaarObjectLocation(query) {
        return new Location(query.userName, query.location, query.locationName);
    }
}

exports.UserDB = UserDB;