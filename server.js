"use strict";
//required imports
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Messages = require('./models/whatsapp');
const Pusher = require("pusher");
const cors = require('cors');
const env = require("dotenv").config({path: __dirname + '/.env'})

//intitalize the app
const app = express();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(static('express'));
// app.use((req,res,next)=>{
//     res.setHeader("Acess-Control-Allow-Origin","*");
//     res.setHeader("Acess-Control-Allow-Headers","*")
//     next();
// })

//templating fe
app.set('view engine','ejs');

//db connections
const dbURI = 'mongodb+srv://ewave:dwave101@cluster0.si5ti.mongodb.net/whatsapp-mern?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true})
.then(result=> console.log('connected to db'))
.catch((err) => console.log(err))

//set an env variable for the port
const port = process.env.PORT


//connect pusher to mongoose
const pusher = new Pusher({
  appId:process.env.appId,
  key:process.env.key,
  secret:process.env.secret,
  cluster:process.env.cluster,
  useTLS:process.env.useTLS
});





const db = mongoose.connection
db.once('open',()=>{

    console.log('connected successfully');
    const whatsapp = db.collection('whatsapps');
    const changeStream = whatsapp.watch()
    changeStream.on('change',(change)=>{
        console.log(change)

    if (change.operationType === 'insert'){

        const messageDetails = change.fullDocument;
        pusher.trigger("messages", "inserted", {
            message: messageDetails.message,
            name: messageDetails.name,
            recieved:messageDetails.recieved,
            timestamp:messageDetails.timestamp
        
        })
    }else {
        console.log('Error triggering pusher')
    }
 })
})



//routes
app.get('/', (req,res)=>{
    res.send('hello world')
});

//sync messages
app.get('/messages/sync',(req,res)=>{
    
    Messages.find((err,data)=>{
        if (err){
            res.status(500).send(err)
        }else {
            res.status(200).send(data)
        }

    })
})

app.post('/messages/new',(req,res)=>{
    const dbMessage = req.body
    Messages.create(dbMessage, (err,data)=>{
        if (err){
            res.status(500).send(err)
        }else {
            res.status(201).send(data)
        }
    })
})


//controllers

//port listening
app.listen(port)
