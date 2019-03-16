
module.exports = (sequelize,type) => {
    return sequelize.define('todo', {
        id: {
            type: type.UUID,
            primaryKey:true,
        },
        title: {
            type:type.STRING
        },
        text: {
            type:type.STRING
        }
    })
}

