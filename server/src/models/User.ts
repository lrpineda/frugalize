import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt'

interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isCorrectPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Must match an email address!"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long!"],
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },


}, {
    versionKey: false,
});

// Set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

// Compare password
userSchema.methods.isCorrectPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

const User = model<IUser>("User", userSchema);

export {User};