const express = require('express')
const express_graphql = require('express-graphql')
const {Schema,root}= require('./graphql/schema')

const app = express()

app.use('/graphql', express_graphql({
    schema:Schema,
    root:root,
    graphiql:true
})
)

app.listen(9000)
