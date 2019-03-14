require('dotenv').load()
const Sequelize = requre('sequelize')

const UserModel = require('./User')
const TodoListModel = require('./TodoList')
const TodoModel = require('./Todo')


const sequelize = new Sequelize(`${process.env.DB}`,`${process.env.USER}`,`${process.env.PASSWORD}`,{
    host:`${process.env.DB_HOST}`,
    dialect:'postgres',
    pool : {
        max:10,
        min:0,
        acquire:30000,
        idle:10000
    }
})

const User = UserModel(sequelize,Sequelize)
const TodoList = TodoListModel(sequelize,Sequelize)
const Todo = TodoModel(sequelize,Sequelize)

User.hasMany(TodoList)
TodoList.hasMany(Todo)

module.exports = {
    User,
    TodoList,
    Todo
}