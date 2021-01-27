const app =require('./app')

console.log(process.env.PORT)

app.listen(process.env.PORT,()=>{
    console.log('Server is up on port'+ process.env.PORT)
})