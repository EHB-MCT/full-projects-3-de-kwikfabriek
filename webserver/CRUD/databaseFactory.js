const {
    Database
} = require('./database.js');

class DatabaseFactory {
    constructor() {
        this.verbinding = null;
    }

    getDatabase() {
        if (this.verbinding == null) {
            this.verbinding = new Database("0.0.0.0", "username", "username", "BioLab");
        }
        return this.verbinding;
    }
}

exports.DatabaseFactory = DatabaseFactory;