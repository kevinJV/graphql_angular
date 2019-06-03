'use strict'

import gql from 'graphql-tag';

export const createProduct = gql`
    mutation createProduct($name: String!, $description: String!){
        createProduct(name: $name, description: $description){
            id,
            name,
            description
        }
    }
`;

export const updateProduct = gql`
    mutation updateProduct($id: Int!, $name: String!, $description: String!){
        updateProduct(id: $id, name: $name, description: $description){
            id,
            name,
            description
        }
    }
`;

export const deleteProduct = gql`
    mutation deleteProduct($id: Int!){
        deleteProduct(id: $id){
            id
        }
    }
`;

export const Products = gql`
    query{
        products{
            id,
            name,
            description
        }
    }
`;