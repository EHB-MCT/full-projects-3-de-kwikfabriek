const mysql = require('mysql');

class Database {
    constructor(host, user, wachtwoord, database) {
        this.host = host;
        this.user = user;
        this.wachtwoord = wachtwoord;
        this.database = database;
        this.mijnVerbinding = null;
    }

    maakVerbindingMetDatabase() {
        this.mijnVerbinding = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.wachtwoord,
            database: this.database
        });

        this.mijnVerbinding.connect(function (err) {
            if (err) {
                console.error('error connecting database: ', err.stack);
            }
            console.log('connected to database: ', this.mijnVerbinding);
        });
    }

    voerSqlQueryUit(mijnSqlQuery, parameterArray = null) {
        return new Promise((resolve, reject) => {
            this.voerAdvancedSqlQueryUit(mijnSqlQuery, true, parameterArray).then(resultaat => {
                resolve(resultaat);
            });
        });
    }

    voerAdvancedSqlQueryUit(mijnSqlQuery, verbindingAutomatischVerbreken = true, parameterArray = null) {
        return new Promise(async (resolve, reject) => {
            this.maakVerbindingMetDatabase();
            await this.mijnVerbinding.query(mijnSqlQuery, parameterArray, function (error, results, fields) {
                if (error) throw error;
                if (results) {
                    if (results.length == 1) {
                        resolve(results[0]);
                    } else {
                        resolve(results);
                    }
                }
            });

            if (verbindingAutomatischVerbreken) {
                this.mijnVerbinding.end(function (err) {
                    console.log('verbinding verbroken');
                });
            }
        });
    };
}

exports.Database = Database;