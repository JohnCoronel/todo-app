const UUID = require('uuid/v4')

module.exports = (sequelize,type) => {
    return sequelize.define('todolist',{
        id:{
            type:type.UUID,
            primaryKey:true,
            defaultValue: UUID()
        },
        title:{
            type:type.STRING, 
        }
    })
}