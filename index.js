const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path: 'variables.env'});

//crear el server
const app = express();



mongoose.Promise = global.Promise;
mongoose.connect(process.env.BD_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('error', (error) => {
    console.log(error);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));

//Cors Options
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) =>  {
        // console.log(origin);
        const existe = whitelist.some( dominio => dominio === origin);
        if ( existe ) {
            callback(null, true)
        } else {
            callback(new Error('No Permitido por CORS'))
        }
    }
}

//Habilitar cors
app.use(cors(corsOptions));

app.use('/', routes());

const port = process.env.PORT;
const host = process.env.HOST;
//Puerto y run
app.listen(port, host, () => {
    console.log('Server running!')
})