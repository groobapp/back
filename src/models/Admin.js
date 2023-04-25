import { Schema, model } from 'mongoose'
import bcrypt from "bcryptjs"

const validateEmail = function(email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const adminSchema = new Schema({

  email: {
    type: String,
    requiered: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    default: 'laurafunes@casuarinasinmobiliaria.com.ar',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    requiered: [true, 'Please enter a password'],
    minlength: 6,
    maxLength: 16,
  },
  propiedades: [
    {
      type: Schema.Types.ObjectId,
      ref: "Propiedad",
    },
    { timestamps: true, versionKey: false },
  ],
 
}, { timestamps: true, versionKey: false })


adminSchema.methods.toJSON = function () {
  let admin = this;
  let adminObject = admin.toObject();
  delete adminObject.password;
  return adminObject;
}

adminSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

adminSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default model('Admin', adminSchema)