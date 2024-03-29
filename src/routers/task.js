const express = require('express')
const Task = require('../models/task')
const auth  = require('../middleware/auth')
const routers = new express.Router()
routers.post('/tasks',auth, async (req,res) => {
    // const task = new Task(req.body)
    const task = new Task({
      ...req.body,
      owner : req.user._id
    })
    try {
      await task.save()
      res.status(201).send(task)
    }
    catch (e){
      res.status(400).send(e)
    }
    // task.save().then(() => {
    //   res.status(201).send(task)
    // }).catch((err) => {
    //            res.status(400).send(err);
    // })
  })
  
  routers.get('/tasks',auth,async(req,res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
      match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
      await req.user.populate({
        path:'tasks',
        match,
        options : {
          limit : parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      }).execPopulate() 
      res.send(req.user.tasks)
    }
    catch(e){
      res.status(500).send()
    }
    // }  Task.find({}).then((tasks) => {
    //       res.send(tasks)
    // }).catch((err) => {
    //  res.status(500).send();
    // })
  })
  
  routers.get('/tasks/:id' ,auth,  async (req,res) => {
  
    const _id = req.params.id
    try {
    //  const task = await Task.findById(_id)
    const task = await Task.findOne({_id,owner : req.user._id})
     if(!task) {
       return res.status(404).send() }
       res.send(task)
     
    }
    catch(e) {
             res.status(500).send()
    }
    // Task.findById(_id).then((task) => {
    //          if(!task )  {
    //            return res.status(400).send()
    //          }
    //          res.status(200).send(task)
    // }).catch((error) => {
    //      res.status(500).send()
    // })
  })
  routers.patch('/tasks/:id' ,auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description']
    const isValidOperation = updates.every((update) => {
           return allowedUpdates.includes(update);
    })
    const _id = req.params.id;
    if(!isValidOperation) {
     return res.status(400).send({error:'Invalid updates'});
    }
    try {
      const task  = await Task.findOne({_id:req.params.id,owner:req.user._id})
        // const task = await Task.findById({})
     
    //   const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
      if(!task) {
        res.status(400).send();
      }
         updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
      res.send(task);
    }
    catch(e) {
      res.status(404).send(e);
    }
  })
  
  routers.delete('/tasks/:id',auth,async(req,res) => {
    const _id = req.params.id;
    try {
      const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
      if(!task ){
        res.status(404).send();
      }  
     res.send(task);
    }
    catch(e)
   {
     res.status(400).send();
   }})
  
   module.exports = routers