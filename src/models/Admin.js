import { Schema, model } from 'mongoose'
import bcrypt from "bcryptjs"

const adminSchema = new Schema({
  email: {
    type: String,
    requiered: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    default: 'laurafunes@casuarinasinmobiliaria.com.ar',
  },
  password: {
    type: String,
    requiered: [true, 'Please enter a password'],
    minlength: 6,
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