const Bcrypt = require('bcrypt')

module.exports = (sequelize,type) => {
    return sequelize.define('user',{
        id: {
            type:type.UUID,
            primaryKey:true
        },
        username: {
            type:type.STRING,
            allowNull:false,
            unique:true,   
        },
        email: {
            type:type.STRING,
            allowNull:false,
            unique:true
        },
        password: {
            type:type.STRING,
            allowNull:false
        }
    },{
        hooks:{
            beforeCreate: (user) => {
                user.password = Bcrypt.hashSync(user.password,10);
            }
        }
    })
}