const Sequelize = require('sequelize')

const Todo = Sequelize.define('todo',{
    id: {
        type:Sequelize.UUID
    },
    text: {
        type:Sequelize.STRING
    },
    
})