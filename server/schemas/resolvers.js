const { AuthenticationError } = require("apollo-server-express");
const { User, Expense, Category } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user){
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate({
                        path: 'expenses',
                        populate: 'category'
                    });
                return userData;
            }
            throw new AuthenticationError("You must be logged in!");
        },

        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate({
                    path: 'expenses',
                    populate: 'category'
                });
        },
        user: async (parent, { email}) => {
            return User.findOne({ email })
                .select('-__v -password')
                .populate({
                    path: 'expenses',
                    populate: 'category'
                });
        },
        expenses: async (parent, { email }) => {
            const params = email ? { email } : {};
            return Expense.find(params).populate('category').sort({ expenseDate: -1 });

        },

        expense: async (parent, {_id}) => {
            return Expense.findById(_id);
        },

        categories: async () => {
            return await Category.find();
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
                const expense = await Expense.create({
                    expenseName: args.expenseName,
                    expenseAmount: args.expenseAmount,
                    category: args.categoryId,
                });

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