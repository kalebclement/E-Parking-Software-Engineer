const express = require('express');
const app = express();
const firebase = require('./admin');
const availability = require('./availability');
const ticket = require('./ticket');

app.use(availability);
app.use(ticket);

app.listen(8000 , () => {
    console.log('server on port 8000')
})

