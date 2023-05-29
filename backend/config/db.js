const mongoose = require("mongoose");

const conn = mongoose.connect('mongodb://127.0.0.1:27017/gram').then(() => {
    console.log('conectado com o mongo');
}).catch((err) => {
    console.log('Houve um erro ao se conectar com o mongo: ' +err)
});


module.exports = conn;