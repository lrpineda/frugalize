const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Must match an email address!"],
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

    expenses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Expense",
        }
    ]
});

// Set up middleware
userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

// Compare password
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;