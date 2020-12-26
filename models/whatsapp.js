const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//user authentication schema
const userSchema = new mongoose.Schema({

    name:String,
    password:{
      type:String,
      required:[true, 'Please enter password'],
      minlength:[6,'Minimum password length is six characters']
  }
})

//whatsapp chat schema
const whatsappSchema = new mongoose.Schema({
    message:{
    type:String,
    required:true,
    lowercase:true,
    },
    name:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users"
        }
      ],
        timestamp:{
            type:String,
            required:true,
            lowercase:true,
            },
    recieved:Boolean
})


userSchema.pre('save', async function (next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
  next();
})


userSchema.statics.login = async function(name, password) {
  const user = await this.findOne({name});
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect name');
};



const Messages = mongoose.model('whatsapps',whatsappSchema);
const User = mongoose.model('users',userSchema);

module.exports = Messages
module.exports = User

