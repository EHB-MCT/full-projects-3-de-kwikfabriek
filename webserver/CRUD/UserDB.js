const bcrypt = require('bcryptjs');
const {
    DatabaseFactory
} = require('./databaseFactory');


const {
    User
} = require('./user.js');

const {
    Image
} = require('./image.js');


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

    getAllImageData(mijnSqlQuery) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit(mijnSqlQuery).then((resultaat) => {
                let resultatenArray = [];
                resultaat.map((value) => {
                    resultatenArray.push(this.converteerQueryNaarObjectImages(value));
                });
                resolve(resultatenArray);
                console.log(resultatenArray);
            });
        });
    }

    getUserFromUserID(UserID) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE id = ?", [UserID]).then((resultaat) => {
                resultaat = this.converteerQueryNaarObject(resultaat)
                resolve(resultaat);
                console.log(resultaat);
            });
        });
    }

    checkPassword(username, password) {
        return new Promise((resolve, reject) => {
            this.getVerbinding().voerSqlQueryUit("SELECT * FROM users WHERE username = ?", [username]).then((resultaat) => {
                console.log(username);
                resultaat = this.converteerQueryNaarObjectPassword(resultaat);
                console.log(resultaat);
                const verifyPass = bcrypt.compareSync(password, resultaat.password);
                console.log(verifyPass);
                resolve(verifyPass);

            });
        });
    }

    createUser(username, password) {
        return new Promise((resolve, reject) => {
            this.hashPass(password).then(hashedPassword => {
                this.getVerbinding().voerSqlQueryUit("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]).then(() => {
                    this.getUserFromUserID(username).then((value) => {
                        resolve(value);
                    });
                });
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

    converteerQueryNaarObjectImages(query) {
        return new Image(query.sampleID, query.time);
    }
}

exports.UserDB = UserDB;