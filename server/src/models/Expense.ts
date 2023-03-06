import { Schema, model } from "mongoose";

const ExpenseSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    versionKey: false,
    timestamps: true,
});

const Expense = model("Expense", ExpenseSchema);

export default Expense;