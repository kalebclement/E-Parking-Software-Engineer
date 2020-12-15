const express = require('express');
const firebase = require('./admin');
const db = firebase.firestore();
const dbstorage = firebase.storage();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/payment/verified', (req, res)=> {
const payment_id = req.body.payment_id;
const reffpayment = db.collection('Payment').doc(payment_id);
reffpayment.update({status : "verified"})
.catch((err) => {
    res.send({status : "error", message : err.message});
})

var ticket_id;
reffpayment.get()
.then(document => {
    const data = document.data();
    ticket_id = data.ticket_id;
    let update = {
        payment_status : "paid" 
    }
    const reffticket = db.collection('Ticket').doc(ticket_id);
    reffticket.update(update)
    .then( ()=> {
        res.send({ status: "ok", ticket_id: ticket_id})
    })
    .catch((err) => {
        res.send( {status: "error", message : err.message});
    })
})
})

app.post('/payment/request', (req, res) => {
    const phone_number = req.body.phone_number;
    const ticket_id = req.body.ticket_id;
    let time_in;
    let time_out;
    var priceresult;

    const reffticket = db.collection('Ticket').doc(ticket_id);
    reffticket.get()
    .then(document => {
        var snapshot = document.data();
        time_in = snapshot.time_in;
        let ts = Date.now();
        time_out = Math.floor(ts/1000);
        var type = snapshot.type;
        price(time_in, time_out,type);
        
    })

    function price(time_in, time_out, type){
        var t_in = new Date(time_in * 1000);
        var t_out = new Date(time_out * 1000);
        var hour_out = t_out.getHours();
        var min_out = t_out.getMinutes(); 
        var hour_in = t_in.getHours();
        var min_in = t_in.getMinutes();
        // var hour_out = 16;
        // var min_out = 7;
        // var hour_in = 8;
        // var min_in = 41;

        var hourresult = (hour_out - hour_in)
        var minresult = (min_out - min_in)
        
        if(0 > minresult){
            minresult = 60 + minresult;
            hourresult = hourresult - 1;
        }
        var multiple = hourresult;
        if(minresult > 15){
            multiple = multiple + 1;
        }

        if(type == 'car'){
            priceresult = multiple * 6000;
        }else{
            priceresult = multiple * 4000;
        }

        let data = {
            phone_number : phone_number,
            ticket_id : ticket_id,
            price : priceresult,
            status: "unverified",
        }

        setpayment(data);
    }

    function setpayment(data){
        const reff = db.collection('Payment').doc();
        reff.set(data)
        .then(()=>{
            res.send({status : "ok", payment_id : reff.id, price : priceresult})
        }).catch((err) => {
            res.send({status : "error", message : err.message})
        })
    }

    
})

module.exports = app;