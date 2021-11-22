const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

// enter  stripe secret key below :
const stripe = require("stripe")("sk_test_51JtViRSDPfCPNYxeGmXzVkDc2tzWJeZJKg26YazFuuyvXzLpP04Sq8T1nScQPwrGtLlC1RmxPtnnjc6396SEk8kY00DPldap50");

// - App Config
const app = express();

//Middlewares
app.use(cors());
app.options('*', cors());
app.use(express.json());

//-API routes
app.get("/", (req, res) => res.status(200).send("Hello from Cloud"));
app.post("/payments/create", async (req, res) => {
    const total = req.query.total;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, 
        currency: 'INR',
    });

    //OK - Created
    res.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
});

// - Listen command
exports.api = functions.https.onRequest(app);

//Example endpoint
// http://localhost:5001/clone-e74d0/us-central1/api