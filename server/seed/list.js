module.exports = (model,users) => {
    return(
        model.bulkCreate([
            {
                title:'A random list',
                userId:users[Math.floor(Math.random()*users.length)].id
            },
            {
                title: 'Work List',
                userId:users[Math.floor(Math.random() * users.length)].id
            }
        ],{individualHooks:true})
    )
}