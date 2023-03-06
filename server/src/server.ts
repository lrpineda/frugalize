import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';

import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './utils/auth';

import db from './config/connection';

const PORT = process.env.PORT || 4001;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

startApolloServer(typeDefs, resolvers);