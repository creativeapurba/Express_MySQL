const express = require("express");
const mysql = require("mysql");

const app = express();
port = 8080

app.use(express.json({ urlencoded: true }))


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

connection.connect()
// connection.query("CREATE TABLE user (username VARCHAR(10), password VARCHAR(10))",(err, result, fields)=>{
//     console.log(result);
// })

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
// Register-- CREATE
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // `INSERT INTO user VALUES(username="${username}", password="${password}")`
    // `INSERT INTO user SET ?`, { username: username, password: password }
    connection.query(`INSERT INTO user SET ?`, { username: username, password: password }, (err, result, fields) => {
        if (err) res.send(err.message)
        console.log(result);
        res.send("User registration successfull")
    })

})

// Login -- READ 
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    connection.query(`SELECT * FROM user WHERE username="${username}"`, (err, result, fields) => {
        if (err) res.send(err.message)
        // console.log(JSON.stringify(result[0]));
        // console.log(JSON.parse(JSON.stringify(result[0])));
        console.log(result);
        if (result.length < 1) {
            res.send("No user found")
        }
        else {
            const user = JSON.parse(JSON.stringify(result[0]))
            // console.log(JSON.stringify(result[0]));
            if (user.password === password) {
                res.send("Login successfull")
            } else {
                res.send("Login unsuccessfull")
            }
        }
    })
})

// Forget passord -- UPDATE
app.put('/update', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    connection.query("UPDATE user SET password = ? WHERE username = ?", [password, username],
        (err, result, fields) => {
            if (err) res.send(err.message)
            console.log(result);
            res.send("Password updated")
        })
})

// DELETE
app.delete('/delete/:username', (req, res)=>{
    const username = req.params.username;
    connection.query('DELETE FROM user WHERE username = ?', [username],
    (err, result, fields) => {
        if (err) res.send(err.message)
        console.log(result);
        res.send("User deleted")
    })
})


app.listen(port, () => {
    console.log("App is running on port " + port);
})