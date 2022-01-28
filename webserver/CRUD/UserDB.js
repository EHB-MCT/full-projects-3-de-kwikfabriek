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

    getUserFromUserName(UserName) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE userName = ?", [UserName]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat)
                resolve(resultaat);
                console.log(resultaat);
            });
        });
    }

    checkPassword(username, password) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE username = ?", [username]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat);
                console.log(resultaat);
                const verifyPass = bcrypt.compareSync(password, resultaat.password);
                console.log(verifyPass);
                resolve(verifyPass);

            });
        });
    }

    checkDuplicates(username, password) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE username = ?", [username]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectPassword(resultaat);
                console.log(resultaat, "check duplicates");
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

    getData(sampleID) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM data WHERE sampleID = ?", [sampleID]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObjectData(resultaat);
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
        return new User(query.id, query.username, query.password);
    }


    converteerQueryNaarObjectPassword(query) {
        return new User(query.username, query.password);
    }

    converteerQueryNaarObjectData(query) {
        return new Image(query.sampleID, query.fileURL);
    }
}

exports.UserDB = UserDB;