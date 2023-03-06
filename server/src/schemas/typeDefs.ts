import { gql } from "apollo-server-express";

const typeDefs = gql`
    type Auth {
        token: ID!
        user: User
    }
    type User {
        _id: ID
        email: String
        firstName: String
        lastName: String
    }
    type Category {
        _id: ID
        name: String
    }
    type Expense {
        _id: ID
        name: String
        amount: Float
        date: String
        category: Category

    }

    type Query {
        me: User
        users: [User]
        user(email: String!): User
        expenses(email: String!): [Expense]
        expense(_id: ID!): Expense
        categories: [Category]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(email: String!, password: String!, firstName: String!, lastName: String!): Auth
        addExpense(name: String!, amount: Float!, category: ID!): Expense
        addCategory(name: String!): Category
    }

`;

export default typeDefs;