const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean,
    GraphQLUnionType,
    GraphQL
} = require('graphql')

const Bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const {User,TodoList,Todo} =  require('../models/sequelize');



const todo = new GraphQLObjectType({
    name:'todo',
    fields:{
        id:{type:GraphQLID},
        title:{type:GraphQLString},
        text:{type:GraphQLString},
        date:{type:GraphQLString}
    }
})
const todoList = new GraphQLObjectType({
    name:'todoList',
    fields:() => ({
        id: { type:GraphQLID },
        title: { type:GraphQLString },
        todos: {
            type: GraphQLList(todo),
            async resolve(obj){
                return Todo.findAll({where:{todolistId:obj.id}})
            }
        }
    })
})

const authResponse = new GraphQLObjectType({
    name:'authResponse',
    fields:{
        err:{type:GraphQLBoolean},
        message:{type:GraphQLString}
    }
})
const forbidden = new GraphQLObjectType({
    name:'forbidden',
    fields:{
        message:{type:GraphQLString}
    }
})
const listQueryResponse= new GraphQLUnionType({
    name:'listQueryResponse',
    types: [forbidden,todoList],
    resolveType(value){
        if (value instanceof forbidden) {
            return forbidden
        }
        return todolist
    }

})

const todoMutationResponse = new GraphQLUnionType({
    name:'todoMutationResponse',
    types:[forbidden,todo],
    resolveType(value){
        if (value instanceof forbidden) {
            return forbidden
        }
        return todo
    }
})

const listMutationResponse = new GraphQLUnionType({
    name:'listMutationResponse',
    types: () => {[forbidden,todolist]}
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
            async resolve(_,args,ctx) {
                const user = await User.findByPk(ctx.user.id)
                const lists = await TodoList.findAll({where:{userId:user.id}})
                return {
                    id:user.id,
                    email:user.email,
                    username:user.username,
                    lists
                }
            }
        },
        list:{
            type:listQueryResponse,
            args:{
                id:{type:GraphQLID}
            },
            async resolve (obj,args,ctx) {
                const list =  await Todolist.findOne({where:{id:args.id}})
                if (list.userId !== ctx.user.id){
                    return {
                        message:"Forbidden"
                    }
                }
                return {
                    title:list.title,
                    id:list.id,
                }

            }
        }
    }
})


const mutationType = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        newUser:{
            type:authResponse,
            args:{
                username:{type:GraphQLString},
                password:{type:GraphQLString},
                email:{type:GraphQLString}
            },
            async resolve (_,{username,email,password}) {
                const user = await User.create({username,email,password})
                return {
                    err: false,
                    message:jsonwebtoken.sign(
                {id:user.id,email:user.email},
                process.env.JWT_SECRET,{expiresIn:'1y'}
                )}}
        },
        newList:{
            type:todoList,
            args: {
                title: {
                    type:GraphQLString
                }
            },
            async resolve (_,args,{user}) {
                const tl = await TodoList.create({title:args.title,userId:user.id})
                console.log(tl.id)
                return {
                    title: tl.title,
                    id: tl.id,
                }
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
                },
                listId:{
                    type:GraphQLID
                }
            },
            async resolve (obj,args,ctx) {
                const todo = await Todo.create({title:args.title,text:args.text,todolistId:args.listId,userId:ctx.user.id})
                return {
                    title:todo.title,
                    date:todo.createdAt,
                    text:todo.text,
                    id:todo.id
                }
            }
        },
        login: {
            type:authResponse,
            args:{
                email:{
                    type:GraphQLString,
                },
                password:{
                    type:GraphQLString,
                }
            },
            async resolve (obj,args,ctx) {
               const user = await User.findOne({where:{email:args.email}})
                if (!user) {
                    return {
                        err:true,
                        message:`No user with email ${args.email} found.`
                    }
                }
                const valid = await Bcrypt.compare(args.password, user.password)
                console.log(valid)
                if (!valid) {
                    return {
                        err:true,
                        message:'Incorrect password'
                    }
                }

                const jwt = jsonwebtoken.sign({
                    id:user.id,
                    email:user.email
                    },process.env.JWT_SECRET,{expiresIn:'1y'})
               return {
                   err:false,
                   message:jwt
               }
            }
        },
        updateTodo:{
            type:todoMutationResponse,
            args: {
                id:{type:GraphQLID},
                title:{type:GraphQLString},
                text:{type:GraphQLString},
                userId:{type:GraphQLString},
            },
            async resolve(obj,{title,text,id,userId},ctx) {
                if(userId !== ctx.user.id) {
                    return {
                        message:'Forbidden'
                    }
                }

                const todo = Todo.update({title,text},{where:{id}})
                return {
                    id,
                    title:todo.title,
                    text:todo.text,
                    date:todo.createdAt
                }
            } 
        },
        deleteTodo:{
            type:todoMutationResponse,
            args:{
                id:{type:GraphQLID},
                userId:{type:GraphQLID}
            },
            async resolve(obj,{id,userId},ctx) {
                if (userId !== ctx.user.id) {
                    return {
                        message:'Forbidden'
                    }
                }
                const deleted = await Todo.destroy({where:{id}})
                return {deleted}
            }
        }
    }
})


const Schema = new GraphQLSchema({
    query:queryType,
    mutation: mutationType
})

module.exports = {Schema}


