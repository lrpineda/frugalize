import { AuthenticationError } from "apollo-server-express";
import  {signToken}  from "../utils/auth";
import { User, Category, Expense } from "../models";

const resolvers = {
    Query: {
        me: async (parent:unknown, args:unknown, context:any) => {
            console.log(typeof context);
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password")
                    .populate("expenses")
                    .populate("categories");
                return userData;
            }
            throw new AuthenticationError("Not logged in");
        }
    },
    Mutation: {
        login: async (parent:unknown, { email, password }:any) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }
            const isPassCorrect = await user.isCorrectPassword(password);
            if (!isPassCorrect) {
                throw new AuthenticationError("Incorrect credentials");
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent:unknown, args:any) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        addCategory: async (parent:unknown, args:any) => {
            const category = await Category.create(args);
            
            return category;
        },
        addExpense: async (parent:unknown, args:any, context:any) => {
            if(context.user){
                const expense = await Expense.create({
                    name: args.name,
                    amount: args.amount,
                    category: args.category,
                });

                return expense;
            }
            throw new AuthenticationError("Not logged in");
        }

    }
};

export default resolvers;