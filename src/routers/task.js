const Task=require('../models/task')
const express=require('express')
const { findById, populate } = require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()


router.get('/task',auth,async (req,res)=>{

    const match={}
    const sort={}

    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }

    if(req.query.completed)
    {
        match.completed= req.query.completed === 'true'
    }

    try{
   // const task=await Task.find({'owner':req.user._id})
    
     await req.user.populate({
            path: 'task',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
     }).execPopulate()
       
    console.log(req.user.task)

    res.send(req.user.task)
    }
    catch(e)
    {
        console.log(e)
        res.status(500).send()
    }

    // Task.find({}).then((task)=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })

})


router.get('/task/:id',auth,async (req,res)=>{

    const _id=req.params.id

    try{

        const task=await Task.findOne({_id,owner:req.user._id})

        if(!task) 
        return res.status(404).send()
        res.send(task)

    }catch(e)
    {
        res.status(500).send()
    }

    // Task.findById(_id).then((task)=>{
        // if(!task)
        // return res.status(404).send()
        // res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })

})

router.post('/task',auth,async(req,res)=>{
    

    const task=new Task({
        ...req.body,           //copy req body to task
        owner:req.user._id
    })
    
    try{
        await task.save()
        res.status(201).send(task)

    }catch(e)
    {
         res.status(400).send(e)
    }

    // task.save().then(()=>{
    //     res.status(201).send(task)

    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })

})

router.patch('/task/:id',auth,async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdate=['description','completed']
    const isValid=updates.every((update)=> allowedUpdate.includes(update))

    if(!isValid)
    return  res.status(404).send({'error':'Invalid update!'})

    try{

        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})

 

       // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       
        if(!task)
        {
        return res.status(404).send()
        }

        updates.forEach((update) => task[update]=req.body[update])
        
        await task.save()
       
        res.send(task)

    }catch(e)
    {
        res.status(404).send(e)
    }

})

router.delete('/task/:id',auth,async (req,res)=>{

    try{

        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

        if(!task)
        return res.sendStatus(404)

        res.send(task)
    }catch(e)
    {
        res.sendStatus(500)
    }
})

module.exports=router