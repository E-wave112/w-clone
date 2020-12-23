"use-strict";
//required imports
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Messages = require('./models/whatsapp');
//intitalize the app
const app = express()
//set an env variable for the port

const port = process.env.PORT || 3030
//db connections
const dbURI = 'mongodb+srv://ewave:dwave101@cluster0.si5ti.mongodb.net/whatsapp-mern?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex:true})
.then(result=> console.log('connected to db') )
.catch((err) => console.log(err))

//templating fe
app.set('view engine','ejs');
//middlewares
app.use(cookieParser);
//routes

app.get('/',(req,res)=>res.send('hello world'));

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