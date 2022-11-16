import { Schema, model } from 'mongoose'
import bcrypt from "bcryptjs"

const validateEmail = function(email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};


const userSchema = new Schema({
  userName: {
    type: String,
    minlength: 2,
    maxlength: 16,
    requiered: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    requiered: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    requiered: [true, 'Please enter a password'],
    minlength: 6,
  },
  birthday: {
    type: Date,
    default: new Date()
  },
  firstName: { type: String, default: "", lowercase: true, },
  lastName: { type: String, default: "", lowercase: true,},
  description: { type: String, default: "", lowercase: true,},
  profilePicture: {
    public_id: String,
    secure_url: String
  },
  gender: { type: String, default: "Other" },
  verificationPay: {type: Boolean, default: false},
  verificationInProcess: {type: Boolean, default: false},
  verified: { type: Boolean, default: false }, 
  online: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  visits: { type: [String] },
  accountMPAsociated: {type: Boolean, default: false},
  explicitContent: { type: Boolean, default: false },
  followers: { type: [String], default: [], trim: true },
  followings: { type: [String], default: [], trim: true },
  likes: { type: [String]},
  publications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Publication",
    },
    { timestamps: true, versionKey: false },
  ],
  cryptoWallets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Crypto",
    },
    { timestamps: true, versionKey: false }
  ],
  fiatWallets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Fiat",
    },
    { timestamps: true, versionKey: false },
  ],
  mpAccount: {
    type: Schema.Types.ObjectId,
    ref: "MpAccount",
  },
  chats: [{
    type: Schema.Types.ObjectId,
    ref: "Chat",
  }],
}, { timestamps: true, versionKey: false });


userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default model('User', userSchema)