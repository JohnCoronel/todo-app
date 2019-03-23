module.exports = (model,lists) => {

    let randomListIndex = Math.floor(Math.random() * lists.length)
    let randomListIndex2 = Math.floor(Math.random() * lists.length)
    console.log('random index',randomListIndex)
    console.log('lists',lists[0].userId)
return (
    model.bulkCreate([
        {
            title:'A random Todo',
            text:'Some Random Text',
            todolistId: lists[randomListIndex].id,
            userId:lists[randomListIndex].userId,
        },
        {
            title:'Finish Assignment',
            text:'This assignment consists of....',
            todolistId:lists[randomListIndex2].id,
            userId:lists[randomListIndex2].userId
        }
    ],{individualHooks:true})
)
}