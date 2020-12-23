const mongoose = require('mongoose');
//whatsapp chat schema
const whatsappSchema = new mongoose.Schema({
    message:String,
    name:String,
    timestamp:String
})

//user authentication schema
