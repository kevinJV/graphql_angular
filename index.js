const express = require('express');

const app = express();

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var { getProducts, addProduct, editProduct, removeProduct } = require('./data/product');

var cors = require('cors');

var schema = buildSchema(`
    type Product {
        description: String,
        name: String,
        id: Int
    },
    type Query {
        hello: String,
        products: [Product],
        product(id: Int!): Product,
    },
    type Mutation {
        createProduct(name: String!, description: String!): Product,        
        updateProduct(id: Int!, name: String!, description: String!): Product,        
        deleteProduct(id: Int!): Product,        
    }
`);

var root = {
    hello: () => {
        return 'hello world!';
    },
    products: async () => {
        console.log(await getProducts())        
        return await getProducts();
    },
    product: async ({ id }) => {
        const products = getProducts();
        return await products.find(p => p.id === id);
    },
    createProduct: async args => {
        const { name, description } = args;
        return await addProduct(name, description);
    },
    updateProduct: async args => {      
        console.log("update")   
        const { id, name, description } = args;
        return await editProduct(id, name, description)
    },
    deleteProduct: async args => {       
        console.log("delete") 
        const { id } = args;
        return await removeProduct(id)
    },
};

//add cors
app.use(cors())

//Create Graphql server
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
)

app.listen(3000);

console.log("Server inicializado en localhost:3000/graphql")