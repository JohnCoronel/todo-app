module.exports = (model) => {
    return (
    model.bulkCreate([
        {
            username:"jmc",
            email:"jmc@abc.com",
            password:"testpw123"
        },
        {
            username:"JaneDoe!",
            email:"Jane@doe.net",
            password:"abc123"
        }
    ],{individualHooks:true})
    )
}