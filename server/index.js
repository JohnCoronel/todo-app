require('dotenv').config()
const express = require('express')
const express_graphql = require('express-graphql')
const jwt = require('express-jwt')
const bodyParser = require('body-parser')

const {Schema}= require('./graphql/schema')

const app = express()




const auth = jwt({secret:process.env.JWT_SECRET,     
                     credentialsRequired: false
})



app.use('/graphql',bodyParser.json(),auth, express_graphql(req => ({
    schema:Schema,
    context:{
        user:req.user
    },
    graphiql:true
}))
)

app.listen(9000)
