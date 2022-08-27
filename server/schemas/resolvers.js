import { AuthenticationError } from "apollo-server-express";
const { User, Expense, Category } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user){
                const userData = await User.findOne({ _id: context.user._id })
                    .Select('-__v -password')
                    .populate('expenses');
                return userData;
            }
            throw new AuthenticationError("You must be logged in!");
        },

        users: async () => {
            return User.find()
                .Select('-__v -password')
                .populate('expenses');
        },
        user: async (parent, { email}) => {
            return User.findOne({ email })
                .Select('-__v -password')
                .populate('expenses');
        },
        expenses: async (parent, { email }) => {
            const params = email ? { email } : {};
            return Expense.find(params).sort({ expenseDate: -1 });

        },

        expense: async (parent, {_id}) => {
            return Expense.findById(_id);
        },

        categories: async (parent, { email }) => {
            const params = email ? { email } : {};
            return Category.find(params);
        }

    },

    Mutation: {
        login: async (parent, { email, password}) => {
            const user = await User.findOne({ email});
            if (!user) {
                throw new AuthenticationError("Invalid credentials!");
            }

            const isPasswordCorrect = await user.isCorrectPassword(password);
            if (!isPasswordCorrect) {
                throw new AuthenticationError("Invalid credentials!");
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        addCategory: async (parent, args) => {
            const category = await Category.create(args);
            return category;
        },
        addExpense: async (parent, args, context) => {
            if(context.user) {
                const expense = await Expense.create({ ...args, email: context.user.email });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { expenses: expense._id } },
                    { new: true }
                );
                return expense;
            }
            throw new AuthenticationError("You must be logged in!");
        }

    }
};

module.exports = resolvers;