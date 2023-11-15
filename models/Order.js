const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    //ID est genere pr MongoDB! nrmlmnt suffira
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, },
    prix: { type: Number, required: true },
    state: {
        type: String,
        default: "Pending",
        //Specifier les status possoble d'un Order (The status should have predefined values like "Pending," "Processing," "Shipped," and "Delivered.")
        enum: ["Pending", "Processing", "Shipped", "Delivered","Cancelled"]

    },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);