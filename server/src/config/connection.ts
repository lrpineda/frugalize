import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/frugalize');

const db = mongoose.connection;
export default db;

