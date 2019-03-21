const UUID = require('uuid/v4')

module.exports = (sequelize,type) => {
    return sequelize.define('todo', {
        id: {
            type: type.UUID,
            primaryKey:true,
            defaultValue: UUID()
        },
        title: {
            type:type.STRING
        },
        text: {
            type:type.STRING
        }
    })
}

