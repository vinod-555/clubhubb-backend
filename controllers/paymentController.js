import Razorpay from "razorpay";
import crypto from "crypto";
const KEY_ID = "rzp_live_zrRLzm4kzwqdx9";
const KEY_SECRET = "EeBMBUynfSIfRR1VqBc1ewvo";

export const orders = (req, res) => {
    let instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

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
    let body =
        req.body.response.razorpay_order_id +
        "|" +
        req.body.response.razorpay_payment_id;

    var expectedSignature = crypto
        .createHmac("sha256", KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === req.body.response.razorpay_signature) {
        res.send({ code: 200, message: "Sign Valid" });
    } else {
        res.send({ code: 500, message: "Sign Invalid" });
    }
};