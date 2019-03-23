require('dotenv').config()
const Sequelize = require('sequelize')
const UserModel = require('./User')
const TodoListModel = require('./TodoList')
const TodoModel = require('./Todo')
const Seed = require('../seed')
const sequelize = new Sequelize({
    database: `${process.env.DATABASE}`,
    username: `${process.env.USERNAME}`,
    logging:true,
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
Todo.belongsTo(User)

if (process.env.NODE_ENV === 'DEV'){
    sequelize.sync({force:true}).then(()=>{
        Seed(User,TodoList,Todo);
    })
  
    
}
module.exports = {
    User,
    TodoList,
    Todo
}