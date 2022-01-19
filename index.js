const express = require('express');
const app = express();
const cors = require('cors');
const bearerToken = require('express-bearer-token');
const dotenv = require('dotenv');
dotenv.config()
const PORT = process.env.PORT;

app.use(bearerToken());
app.use(cors());
app.use(express.json());

const { db } = require('./config/database')

db.getConnection((err, connection) => {
    if (err) {
        console.log(`Error MySQL Connection`, err.message)
    }
    console.log(`Connected to MySQL Server: ${connection.threadId}`)
})

app.get('/', (req, res) => {
    res.status(200).send(`<h2>Welcome</h2>`)
})

const { usersRouter, shipmentsRouter } = require('./routers')

app.use("/users", usersRouter)
app.use("/shipments", shipmentsRouter)

app.listen(PORT, () => console.log(`JoExpress API Running:`, PORT))