module.exports = (sequelize,type) => {
    return sequelize.define('todolist',{
        id:{
            type:type.UUID,
            primaryKey:true
        },
        title:{
            type:type.STRING, 
        }
    })
}