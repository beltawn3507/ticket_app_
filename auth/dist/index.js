"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongoose_1 = __importDefault(require("mongoose"));
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO URI must be defined');
    }
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to mongo-db', process.env.MONGO_URI);
    }
    catch (err) {
        console.error(err);
    }
    app_1.app.listen(3000, () => {
        console.log("listening on port 3000 ..!!!!!");
    });
};
start();
