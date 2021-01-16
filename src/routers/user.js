const User=require('../models/user')
const express=require('express')
const auth =require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')

const router=new express.Router()



router.post('/users',async (req,res)=>{

    const user=User(req.body)

    try{
        const token=await user.generateAuthToken()
        await user.save()
        res.status(201).send({user,token})
    }catch(e)
    {
        res.status(400).send(e)
    }

    // const user=new User(req.body)

    // user.save().then((result)=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.get('/users/me',auth,async (req,res)=>{

    res.send(req.user)

})


router.patch('/users/me',auth,async(req,res)=>{
//object.keys convert object(body) to array of keys
    const updates=Object.keys(req.body)
    const allowedUpdate=['name','email','password','age']

    const isValid=updates.every((update)=> allowedUpdate.includes(update))

    if(!isValid)
    return res.status(400).send({error:'invalid updates!'})

    try{
        //const user=await User.findById(req.params.id)

        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })

        await req.user.save()

        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user)
        // return res.sendStatus(404)
        res.send(req.user)
    }
    catch(e)
    {
        res.status(404).send(e)
    }
})


router.delete('/users/me',auth,async (req,res)=>{

    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user)
        // return res.sendStatus(404)
        await req.user.remove()
        res.send(req.user)
    }catch(e)
    {
        res.sendStatus(500)
    }
})

router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        
        const token= await user.generateAuthToken()
        res.send({user,token})

    }catch(e)
    {
        res.sendStatus(400)
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try{

        req.user.tokens=req.user.tokens.forEach((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.send()

    }catch(e)
    {
        res.sendStatus(500)
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try{

        req.user.tokens=[]

        await req.user.save()
        res.sendStatus(200)
        
    }catch(e)
    {
        res.sendStatus(500)
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/))
        return cb(new Error("Please upload png/jpg/jpeg file"))
        
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    
    const buffer=await sharp(req.file.buffer).resize({width:250,heighr:250}).png().toBuffer()
   
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({ error : error.message})
})


router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async (req,res)=>{
        try{
            const user=await User.findById(req.params.id)

            if(!user || !user.avatar)
            {
                throw new Error()
            }

            res.set('Content-Type','image/png')
            res.send(user.avatar)

        }catch(e)
        {
            res.status(404).send()
        }
})


module.exports=router