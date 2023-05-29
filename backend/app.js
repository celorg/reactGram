require("dotenv").config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT;

const app = express();

//config
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Cors
app.use(cors({creditials: true, origin: 
    [
    "http://localhost:3000",
    "http://localhost:19006"
    ]
}));

//upload
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//DB connction
require("./config/db.js")

//routes
const router = require("./routes/Router.js");
app.use(router);

app.listen(port, () => {
    console.log("App rodando na porta: " + port);
})