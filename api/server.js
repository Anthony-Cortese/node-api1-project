// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model.js');

//instance of express app
const server = express();

//global middleware
server.use(express.json())

// [GET] /api/users
server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        console.log('users:', users)
        res.status(200).json(users)
    })
    .catch(err => {
        console.log('err:', err)
        res.status(500).json({message: err.message})
    })
})

// [GET] /api/users:id
server.get('/api/users/:id', (req,res) =>{
    const {id} = req.params
    User.findById(id)
    .then(user => {
        if(!user){
            res.status(404).json("user does not exist")
        } else {
            console.log('user:', user)
        res.status(200).json(user)
        }
        
    })
    .catch(err => {
        console.error('err:', err)
        res.status(500).json({message: err.message})
    })
})

//[POST] /api/users
server.post('/api/users', (req, res) => {
    const newUser = req.body
    if(!newUser.name || !newUser.bio) {
        res.status(422).json("Please provide a name and a bio for the user")
    }else{
        User.insert(newUser)
        .then(user => {
            res.status(201).json(user)
            })
            .catch(err => {
                console.log('Posterr:', err)
                res.status(500).json({message: "these was an error"})
            })
        }
})

// [PUT] /api/users/:id
server.put("/api/users/:id", async (req, res) => {  
    const { id } = req.params;  
    const changes = req.body;  
    try {    
        if (!changes.name || !changes.bio) {      
            res.status(422).json("Need name and bio");    
        } else {      
            const updatedUser = await User.update(id, changes);      
            if (!updatedUser) {        
                res.status(404).json("User does not exist");      
            } else {        
                res.status(200).json(updatedUser);      
            }    
        }  
    } catch (err) {    
        res.status(500).json({ message: err.message });  }});

// [DELETE] /api/users/:id
server.delete("/api/users/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const deletedUser = await User.remove(id)
        if(!deletedUser) {
            res.status(404).json("This person does not exist")
        } else {
            res.status(200).json(deletedUser)
        }
    }catch (err) {    
        res.status(500).json({ message: err.message });  }});
    
    


module.exports = server; // EXPORT YOUR SERVER instead of {}
