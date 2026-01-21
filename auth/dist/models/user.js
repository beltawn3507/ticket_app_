"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const password_1 = require("../services/password");
// mongoos defintion of the type of data
const userSchema = new mongoose_1.default.Schema({
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
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await password_1.Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});
// to create new user we will use User.build
// whenever we create new user it does not apply type checking
userSchema.statics.build = (attrs) => {
    return new User(attrs);
};
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
