const mongoose = require('mongoose');
//whatsapp chat schema
const whatsappSchema = new mongoose.Schema({
    message:String,
    name:String,
    timestamp:String,
    recieved:Boolean
})

//user authentication schema




const Messages = mongoose.model('whatsapp',whatsappSchema);

module.exports = Messages
