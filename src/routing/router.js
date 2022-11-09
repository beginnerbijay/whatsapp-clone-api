const express = require('express')
const router = express.Router();
const user = require('../model/user')
const Messages = require('../model/message')

router.get("/:id",async(req,res)=>{
    try{
        const client = await user.find({_id:{ $ne: req.params.id }}).select([
            "email",
            "name",
            "avatar",
            "_id",
          ]);
        res.json(client)
        console.log(client)
    }catch(e){
        console.log(e)
    }
})

router.post('/add',async(req,res)=>{
    try{
        const {name,email,phone,password} = req.body.input
        const avatar = req.body.avatar
        const client = new user({name,email,phone,password,avatar})
        const data = await client.save();
        if(data){
            res.json(data)
        }else{
            res.json("sign off fail")
        }
    }catch(e){
        console.log(e)
    }
})

router.post('/login',async(req,res)=>{
    try{
        const {name,password} = req.body
        const data = await user.findOne({name:name})
        if(data.password==password){
            res.json(data)
        }else{
            res.json("log in fail")
        }
    }catch(e){
        console.log(e)
    }
})

router.post("/getmsg",async(req,res)=>{
    try{
        const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
    }catch(e){
        console.log(e)
    }
})

router.post("/addmsg",async(req,res)=>{
    try{
        const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
    }catch(e){
        console.log(e)
    }
})


module.exports=router