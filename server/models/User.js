module.exports = (sequelize,type) => {
    return sequelize.define('User',{
        id: {
            type:type.UUID,
            primaryKey:true
        },
        username: {
            type:type.STRING   
        },
        email: {
            type:type.STRING
        }
    })
}