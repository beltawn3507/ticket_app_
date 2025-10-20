import mongoose from "mongoose";
import { Password } from "../services/password";

// an interface that describes the props to create new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties 
// using this we add a static function to the User
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

// it will tell typescript the functionalities of mongoose 
// we can use .save() etc
// typescript also recognises createdat updatedat etc
interface UserDoc extends mongoose.Document{
    email:string,
    password?:string
}

// mongoos defintion of the type of data
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  }, 
  password: {
    type: String, 
    required: true,
  },
});

// 
userSchema.pre('save',async function(done){
  if(this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'));
    this.set('password',hashed);
  }
  done();
});

// to create new user we will use User.build
// whenever we create new user it does not apply type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc,UserModel>("User", userSchema);


export { User };
