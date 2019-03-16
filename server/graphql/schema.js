const {buildSchema} = require('graphql')
const {User,TodoList,Todo} =  require('../models/sequelize');


const Schema = buildSchema(`
    type User {
        id: ID,
        username:String,
        email:String,
        lists:[List]
    },

    type List {
        id:ID,
        title:String,
        todos:[Todo]
    },

    type Todo {
        id:ID,
        title:String,
        text:String
    }

    type Query {
        user(id:ID):User
    }

    type Mutation {
        user(username:String!,email:String!,password:String!):User!
    }

`)

const root = {
    Query: {
    user: (_,{id}) => User.findByPk(id),
    lists:(obj) => TodoList.findAll({where:{userId:obj.id}}),
    todos:(obj) => Todo.findAll({where:{listId:obj.id}}),
    list: {
        title: (parent) => parent.title,
        id: (parent) => parent.id,
    },
    todo: {
        title: (obj) => obj.title,
        text: (obj) => obj.text,
        id: (obj) => obj.id
    }
    },
    Mutation: {
        user:(_,args) => User.create({username:args.username,email:args.email,password:args.password})
    }

}

module.exports = {Schema,root}


