const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();


app.use(express.json());
app.use(bodyParser.json());

app.use('/', routes)


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

