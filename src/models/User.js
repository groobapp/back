import { Schema, model } from 'mongoose'
import bcrypt from "bcryptjs"

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const userSchema = new Schema({
  userName: {
    type: String,
    minlength: 2,
    maxlength: 16,
    requiered: true,
    lowercase: false,
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
  firstName: { type: String, lowercase: true, },
  lastName: { type: String, lowercase: true, },
  phone: { type: Number },
  description: { type: String, default: "", lowercase: false, },
  profilePicture: {
    public_id: String,
    secure_url: String
  },
  role: { type: String, default: "user" },
  denouncement: [],
  gender: { type: String, default: "Other" },
  receiveVideocall: { type: Boolean, default: false },
  monetizationActive: { type: Boolean, default: false },
  viewExplicitContent: { type: Boolean, default: false },
  verificationPay: { type: Boolean, default: false },
  verificationInProcess: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  visits: { type: [String] },
  followers: { type: [String], default: [], trim: true },
  followings: { type: [String], default: [], trim: true },
  likes: { type: [String] },
  purchases: {
    type: [String]
  },
  expoPushToken: {
    type: String, trim: false, default: ""
  },
  publications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Publication",
    },
    { timestamps: true, versionKey: false },
  ],
  chats: [{
    type: Schema.Types.ObjectId,
    ref: "Chat",
  }],
  notifications: [{
    userName: String,
    profilePic: String,
    event: String,
    link: String,
    date: Date,
    read: Boolean,
  }],
  wallet: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
  },
}, { timestamps: true, versionKey: false })


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