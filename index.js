const express = require('express');
const app = express();
const firebase = require('./admin');
const availability = require('./availability');
const ticket = require('./ticket');
const exitparking = require('./exitparking');
const payment = require('./payment');

app.use(availability);
app.use(ticket);
app.use(exitparking);
app.use(payment);

app.get('/', (req, res) => {
    res.send("E-PARKING MANAGEMENT SYSTEM API");
    
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


let ts = Date.now();
let time = Math.floor(ts/1000)
timeConverter(time);

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var DATE = date + ' ' + month + ' ' + year; 
    var TIME = hour + ':' + min ;
}

