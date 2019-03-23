const UserSeed = require('./user');
const ListSeed = require('./list');
const TodoSeed= require('./todo');



module.exports = (userModel,listModel,todoModel) => {
    UserSeed(userModel).then((result) => {
        console.log(result[0].id)
        ListSeed(listModel,result).then(lists => {
            TodoSeed(todoModel,lists)
        })
    })
}

