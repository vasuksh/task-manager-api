const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/task')
const { findByIdAndUpdate, update } = require('./models/user')
const userRouter=require('../src/routers/user')
const taskRouter=require('../src/routers/task')



const app=express()
const port=process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log('Server is up on port'+ port)
})