require('dotenv').config({ silent: process.env.NODE_ENV === 'production',path:'config/dev.env'})
const mongoose=require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
 useUnifiedTopology: true 
})


