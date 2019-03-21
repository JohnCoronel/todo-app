require('dotenv').config()
const Sequelize = require('sequelize')
const UUID = require('uuid/v4')
const UserModel = require('./User')
const TodoListModel = require('./TodoList')
const TodoModel = require('./Todo')


const sequelize = new Sequelize({
    database: `${process.env.DATABASE}`,
    username: `${process.env.USERNAME}`,
    logging:false,
    password:null,
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


sequelize.sync()

module.exports = {
    User,
    TodoList,
    Todo
}