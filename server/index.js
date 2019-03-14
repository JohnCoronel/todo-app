const express = require('express')
const express_graphql = require('express-graphql')
const { buildSchema } = require('graphql')

const Schema = buildSchema(`
 type Query {
     user(id:Int!):User
     todoList(id:Int!): TodoList
 },

 type Mutation {

 }
 type User {
     id: Int
     username:String
     todoLists:[TodoList]
 },

 type TodoList {
     id:Int
     title:String
    todos:[Todo]
 },

 type Todo {
     id:Int
     text:String
 }
 
 
`)

const root = {
    user:getUser,
    todoList:getTodo
}

const app = express()

app.use('graphql', express_graphql({
    schema:Schema,
    rootValue:root,
})
)

app.listen(9000)
