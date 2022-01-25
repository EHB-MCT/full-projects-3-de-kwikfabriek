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
    User
} = require('./CRUD/user.js');

const {
    UserDB
} = require('./CRUD/UserDB.js');


app.use(bodyParser.json());
app.use(cors());

let host = "db";
let username = "username";
let password = "username";
let database = "BioLab";


// app.post("/upload", upload.single('image'), (req, res) => {
//     if (!req.file) {
//         console.log("No file upload");
//     } else {
//         console.log(req.file.filename)
//         var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
//         var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
//         db.query(insertData, [imgsrc], (err, result) => {
//             if (err) throw err
//             console.log("file uploaded")
//         })
//     }
// });

app.get('/', (req, res) => {
    console.log("Mainpage")
    res.status(200).send({
        message: "Server Biolab",
    });
})

app.get('/users', (req, res) => {
    console.log("All users")
    let Users = new UserDB()
    const allUsers = Users.getAll();
    res.status(200).send(allUsers);
})


app.get('/user', (req, res) => {
    console.log("One users")
    let Student = new UserDB()
    const student = Student.getUserFromUserID("1");
    res.status(200).send({
        value: student,
        message: "Name of one student"
    });
})

app.get('/images', (req, res) => {
    console.log("All images")
    res.send('All images')
})


app.get('/addUser', function (req, res) {
    console.log("Add user")
    try {
        var con = mysql.createConnection({
            host: "db",
            user: "username",
            password: "username",
            database: "BioLab"
        });

        if (!con) {
            console.log("Connection failed");
        } else {
            var QUERY = "INSERT INTO users (username, password) VALUES ('Georgette', '1578')";
            con.query(QUERY, (err, results) => {
                if (err) throw err
                console.log("Query succesfull")
                res.send(results)
            })
        }
    } catch (error) {
        console.log(error, "Sending doesn't work")

    } finally {
        console.log("User added to BioLab server.")
    }

});


app.get('/test', (req, res) => {
    var con = mysql.createConnection({
        host: "db",
        user: "username",
        password: "username",
        database: "BioLab"
    });

    // Connecting to the database.
    con.connect(function (err, connection) {
        // Executing the MySQL query (select all data from the 'users' table).
        con.query('SELECT * FROM users', function (error, results, fields) {
            // If some error occurs, we throw an error.
            if (error) throw error;
            // Getting the 'response' from the database and sending it to our route.
            res.send(results)
        });
    });
})



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});