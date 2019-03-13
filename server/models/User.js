const Sequelize = require('sequelize')

const User = Sequelize.define('user',{
    username: {
        type:Sequelize.STRING,
    },
    id : {
        type:Sequelize.UUID,
        primaryKey:true
    },
    email: {
        type: Sequelize.STRING
    }
})