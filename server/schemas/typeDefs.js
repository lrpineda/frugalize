import { gql } from 'apollo-server-express';

// Define the schema using the GraphQL schema language
const typeDefs = gql` 
    type Auth {
        token: ID!
        user: User
    }
    type User {
        _id: ID
        email: String
        expenses: [Expense]
    }
    type Expense {
        _id: ID
        expenseName: String
        expenseAmount: Float
        expenseDate: String
        category: Category
    }
    type Category {
        _id: ID
        name: String
        expenses: [Expense]
    }
    
    type Query {
        me: User
        users: [User]
        user(email: String!): User
        expenses(email: String!): [Expense]
        expense(id: ID!): Expense
        categories(email: String!): [Category]

    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addCategory(name: String!): Category
        addUser(email: String!, password: String!, firstName: String!, lastName: String!): Auth
        addExpense(expenseName: String!, expenseAmount: Float!, categoryId: ID!): Expense
    }

`;
