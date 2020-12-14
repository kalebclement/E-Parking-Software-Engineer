const express = require('express');
const app = express();
const firebase = require('./admin');
const availability = require('./availability');
const ticket = require('./ticket');
const exitparking = require('./exitparking');

app.use(availability);
app.use(ticket);
app.use(exitparking);

app.get('/', (req, res) => {
    res.send("E-PARKING MANAGEMENT SYSTEM API");
    
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
