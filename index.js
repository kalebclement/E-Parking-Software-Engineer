const express = require('express');
const app = express();
const firebase = require('./admin');
const availability = require('./availability');
const ticket = require('./ticket');

app.use(availability);
app.use(ticket);

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
