const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
} = require('graphql')

const Bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const {User,TodoList,Todo} =  require('../models/sequelize');


const todo = new GraphQLObjectType({
    name:'todo',
    fields:{
        id:{type:GraphQLID},
        title:{type:GraphQLString},
        text:{type:GraphQLString}
    }
})

const todoList = new GraphQLObjectType({
    name:'todoList',
    fields:{
        id: { type:GraphQLID },
        title: { type:GraphQLString },
        todos: {
            type: GraphQLList(todo),
            async resolve(obj){
                return Todo.findAll({where:{todolistsId:obj.id}})
            }
        }
    }
})

const user = new GraphQLObjectType({
    name:'user',
    fields:{
        id: {type:GraphQLID},
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        lists:{type:GraphQLList(todoList)}
    } 
})


const queryType = new GraphQLObjectType({
    name:'Query',
        fields: {
            user: {
                type: user,
            args:{
                id: {type: GraphQLID}
            },
            async resolve(parentValue,args,ctx) {
                
                const user = await User.findByPk(args.id)
                // const lists = await TodoList.findAll({where:{UserId:user.id}})
                console.log('user is ',user)
                return {
                    id:user.id,
                    email:user.email,
                    username:user.username
                    // lists
                }
            }
        }
    }
})


const mutationType = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        newUser:{
            type:GraphQLString,
            args:{
                username:{type:GraphQLString},
                password:{type:GraphQLString},
                email:{type:GraphQLString}
            },
            async resolve (_,{username,email,password}) {
                const user = await User.create({username,email,password})
                return jsonwebtoken.sign(
                {id:user.id,email:user.email},
                process.env.JWT_SECRET,{expiresIn:'1y'}
                )}
        },
        newList:{
            type:todoList,
            args: {
                title: {
                    type:GraphQLString
                }
            },
            async resolve (obj,args,ctx) {
                const tl = await TodoList.create({title:args.title,UserId:ctx.user.id})
                return tl
             }
        },
        newTodo:{
            type: todo,
            args:{
                title:{
                    type:GraphQLString
                },
                text:{
                    type:GraphQLString
                }
            },
            async resolve (obj,args,ctx) {
                return Todo.create({title:args.title,text:args.text,todoListsId:ctx.todolistsId})
            }
        },
        login: {
            type:GraphQLString,
            args:{
                email:{
                    type:GraphQLString,
                },
                password:{
                    type:GraphQLString,
                }
            },
            async resolve (obj,args,ctx) {
               const user = User.findOne({where:{email:args.email}})
                if (!user) {
                    throw new Error('No user found with that email')
                }
                const valid = await Bcrypt.compare(args.password, user.password)

                if (!valid) {
                    throw new Error('Incorrect password')
                }

                const jwt = jsonwebtoken.sign({
                    id:user.id,
                    email:user.email
                },process.env.JWT_SECRET,{expiresIn:'1y'})
               return jwt
            }
        }
    }
})


const Schema = new GraphQLSchema({
    query:queryType,
    mutation: mutationType
})

module.exports = {Schema}


