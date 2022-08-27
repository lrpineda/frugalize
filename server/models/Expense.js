import { Schema, model } from "mongoose";

const expenseSchema = new Schema({
    expenseName: {
        type: String,
        required: true,
        minlenght: 1,
    },
    expenseAmount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    expenseDate: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }
});

const Expense = model("Expense", expenseSchema);

module.exports = Expense;