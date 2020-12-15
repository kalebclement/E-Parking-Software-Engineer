const express = require('express');
const firebase = require('./admin');
const db = firebase.firestore();
const dbstorage = firebase.storage();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/exitparking/scan', (req, res) => {
    const ticket_id = req.body.ticket_id;
    let ts = Date.now();
    let time_out = Math.floor(ts/1000);

    function updateavailability(parking_code){
        const availability = db.collection('Availability');
        availability.get()
        .then(doc => {
            doc.forEach(document => {
                var data = document.data();
                if(data.parking_code == parking_code){
                    if(data.status == "unavailable"){
                        availability_id = document.id;
                        const reffparkingupdate = db.collection('Availability').doc(availability_id);
                        reffparkingupdate.update({status : "available"})
                        .then(()=> {
                            res.send({status : "ok"});
                        })
                        .catch((err) => {
                            res.send({status : "error", message : err.message})
                        })
                    }
                }
            })
        })
    }


    const reff = db.collection('Ticket').doc(ticket_id);
    reff.get()
    .then(document => {
        var data = document.data();
        if(data.payment_status == 'unpaid'){
            res.send( {status : "error", message : "please paid your ticket first before the exit"} );
        }
        else{
            const parking_code = data.parking_code;
            const type = data.type;
            const license = data.license;
            const date = data.date;
            const created_time = data.created_time;
            const time_in = data.time_in;

            let  exitparking = {
                parking_code : parking_code,
                type : type,
                license : license,
                date : date,
                created_time : created_time,
                time_in : time_in,
                time_out : time_out,
            }
            const reff = db.collection('ExitParking').doc();
            reff.set(exitparking)
            .then(() => {
                updateavailability(parking_code);
            })
        }
        
    })
})

module.exports = app;