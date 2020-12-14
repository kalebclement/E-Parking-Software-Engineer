const express = require('express');
const firebase = require('./admin');
const db = firebase.firestore();
const dbstorage = firebase.storage();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());


app.post('/ticket/entry/scan', (req, res) => {
    var ticket_id = req.body.ticket_id;
    let update = {
        status : "verified",
        payment_status : "unpaid"
    }

    const reff = db.collection('Ticket').doc(ticket_id);
        reff.update(update)
        .then( (resp) => {
            res.send({status : "ok"})
        }).catch((err) => {
            res.send( {status : "error"});
        })
})


app.post('/ticket/entry', (req, res) => {
    var parking_code = req.body.parking_code;
    var type = req.body.type;
    var date = req.body.date;
    var time = req.body.time;
    var license = req.body.license;
    var status = "unverified";
    var availability_id;

    var update = {
        status : "unavailable"
    }
    
    const reffparking = db.collection('Availability');
    reffparking.get()
    .then(doc => {
        doc.forEach(document => {
            var data = document.data();
            if(data.parking_code == parking_code){
                if(data.status == "available"){
                    availability_id = document.id;
                    const reffparkingupdate = db.collection('Availability').doc(availability_id);
                    reffparkingupdate.update(update)
                    .catch((err) => {
                        res.send({status : err})
                    })
                    generateticket();
                } else {
                    res.send({status: "error", message: "parking spot unavailable, please try again later"})
                }
            }
        })
        
    })

   function generateticket(){
        const reff = db.collection('Ticket').doc();
        let data = {
            parking_code : parking_code,
            type : type,
            date : date,
            time : time,
            license: license,
            status: status
        }
        reff.set(data)
        .then( () => {
            res.send({ticket_id : reff.id, status: "ok"});
        }).catch((err) => {
            res.send(err);
        })
   } 
    
})




module.exports = app;