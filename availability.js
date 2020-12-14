const express = require('express');
const firebase = require('./admin');
const db = firebase.firestore();
const dbstorage = firebase.storage();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/parkingspot/availability', (req, res) => {
    var parking_code = req.body.parking_code;
    const type  = req.body.type;
    const reff = db.collection('Availability').doc(parking_code);
    reff.get()
    .then(doc => {
        var data = doc.data();
        if(data.status == 'available'){
            res.send({ status: "ok"})
        }else{
            res.send( {status: "error"})
        }
    })
    
})

app.get('/parkingspot/availability/view', (req, res) => {
    let data = [];
    const reff = db.collection('Availability');
    reff.get()
    .then(doc => {
        doc.forEach(document => {
            data.push(document.data());
        })
        res.send(data);
    })

})





module.exports = app;