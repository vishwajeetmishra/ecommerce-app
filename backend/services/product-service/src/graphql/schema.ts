import { gql } from 'graphql-tag';
export const typeDefs = gql`
    type Product @key(fields:"id"){
        id: ID!
        name: String!
        description: String
        price: Float!
        createdAt: String!
        updatedAt: String!
    }

    type Query{
        products: [Product!]!
        product(id: ID!): Product
    }

    type Mutation{
        createProduct(name: String!, description: String, price: Float!, stock: Int!): Product!
        deleteProduct(id: ID!): Boolean!
    }
`