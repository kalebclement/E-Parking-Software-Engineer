var admin = require("firebase-admin");

var serviceAccount = require("./e-parking-b149c-firebase-adminsdk-4i0iu-c917da439b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;