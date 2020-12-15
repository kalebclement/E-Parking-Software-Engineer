const express = require('express');
const firebase = require('./admin');
const db = firebase.firestore();
const dbstorage = firebase.storage();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());


app.post('/ticket/entry/scan', (req, res) => {
    var ticket_id = req.body.ticket_id;
    //get current date and time
    let ts = Date.now();
    let time_in = Math.floor(ts/1000)

    let update = {
        status : "verified",
        payment_status : "unpaid",
        time_in : time_in,
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
    var date;
    var license = req.body.license;
    var status = "unverified";
    var availability_id;

    //get current date and time
    let ts = Date.now();
    let timestamp = Math.floor(ts/1000)
    timeConverter(timestamp);

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var datee = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var DATE = datee + ' ' + month + ' ' + year;
        var TIME = hour + ':' + min ;
        date = DATE;
    }
    updateavailability();

    function updateavailability(){
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
    }

   function generateticket(){
        const reff = db.collection('Ticket').doc();
        let data = {
            parking_code : parking_code,
            type : type,
            date : date,
            created_time : timestamp,
            license: license,
            status: status
        }
        reff.set(data)
        .then( () => {
            tickettimeout(reff.id);
            res.send({ticket_id : reff.id, status: "ok"});
        }).catch((err) => {
            res.send(err);
        })
   } 

   function tickettimeout(ticket_id){
    // 15 minute = 900000
    // 1 minute =   60000
    // 1 second =    1000
    const taksID = setTimeout(() => checkticketverified(ticket_id), 60000)
   }

   function checkticketverified(ticket_id){
       const reff = db.collection('Ticket').doc(ticket_id)
       reff.get()
       .then((document) => {
           const data = document.data();
           if(data.status == "unverified"){
               deletebooking(ticket_id);    
           }
       }) 
    }

   

   function deletebooking(ticket_id){
       db.collection('Ticket').doc(ticket_id).delete();
       let data = {
           status: "available"
       }
       const reff = db.collection('Availability').doc(availability_id);
       reff.update(data)
       .then(() => {
           console.log('ticket with id (', ticket_id , ')has expired');
       }).catch((err) => {
           console.log(err.message);
       })
   }
    
})




module.exports = app;