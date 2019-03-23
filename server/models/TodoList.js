
module.exports = (sequelize,type) => {
    return sequelize.define('todolist',{
        id:{
            type:type.UUID,
            primaryKey:true,
            defaultValue: type.UUIDV1
        },
        title:{
            type:type.STRING, 
        }
    })
}