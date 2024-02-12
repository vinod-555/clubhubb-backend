
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { registerEvent } from './eventController.js';

dotenv.config();
export const orders = (req, res) => {
     
    let instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET });

    var options = {
        amount: req.body.amount * 100, // amount in the smallest currency unit
        currency: "INR",
    };
    console.log(options);

    instance.orders.create(options, function (err, order) {
        if (err) {
            return res.send({ code: 500, message: "Server Err." });
        }
        return res.send({ code: 200, message: "order created", data: order });
    });
};


export const verfiy = (req, res) => {
     console.log(req.body.registrationData)
    let body =
        req.body.response.razorpay_order_id +
        "|" +
        req.body.response.razorpay_payment_id;

    var expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === req.body.response.razorpay_signature) {
        req.body=req.body.registrationData
        registerEvent(req,res)
        
     } else {
        res.send({ code: 500, message: "Sign Invalid" });
    }
};
