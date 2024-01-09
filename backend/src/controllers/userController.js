const{users,posts,comments} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRegister =async (req,res) => {
    try{
        const { userName, pwd } = req.body;
        if(!userName || !pwd){
            return res.status(404).json({"message":"User name and password are required."});
        } 
        const duplicate = await users.findOne({where: {name:userName}});
        if(duplicate) {
            return res.status(409).json({"message":"User name already exists!"});
        }
        const hashedPwd = await bcrypt.hash(pwd,10);
        const user = await users.create({name:userName,pwd:hashedPwd});
        res.status(201).json({"message":`User ${user.name} has successfully registered!`});
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const getUsers = async (req,res) => {
    try{
        const allUsers = await users.findAll({include: [posts,comments]});
        if(allUsers.length === 0){
            return res.status(200).json({"message":"Did not find any users"});
        }
        res.status(200).json(allUsers); 
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const updateUser = async (req,res) => {
    try{
        const {id} = req.params;
        const {name, password} = req.body;
        const condition = !id || (Number(id) && Number(id)>0);
        if(!condition){
            return res.status(400).json({"message":"Id not found or wrong Id"});
        } 
        const user = await users.findOne({
            where: {id}
        });
        if(!user){
            return res.status(400).json({"message":"User not found!"});
        }
        if(name){
             user.name = name;
        }
        if(password){
            user.pwd = await bcrypt.hash(password,10);
        }
        await user.save();
        const cookie = req.cookies;
        if(!cookie?.jwt) {
            return res.status(201).json({"message":"User info updated",user});
        }
        const accessToken = jwt.sign(
            {'username': user.name},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m'}
        );
        const refreshToken = jwt.sign(
            {'username': user.name},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        await user.update({refreshToken});
        res.cookie('jwt',refreshToken,{
            httpOnly: true, 
            maxAge:24*60*60*1000
        });
        return res.status(201).json(
            {
                accessToken,
                user
            }
        );
        
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const deleteUser = async (req,res)=> {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({"message":"User id is not found!"});
        }
        if(isNaN(Number(id)) || Number(id)<0){
            return res.status(406).json({"meesage":"id is not acceptable"});
        }
        const user = await users.findOne({
            where: {id}
        });
        if(!user){
            return res.status(400).json({"message":"User not found!"});
        }
        user.status = 'DEACTIVATED';
        await user.save();
        res.status(201).json({"message":"User deleted"});
    }catch(err){
        res.status(500).json({"message":err.message});
    }
}

const getUser = async (req,res) => {
    try{
        const {id} = req.params;
        
        if(!id){
            return res.status(400).json({"message":"User id is not found!"});
        }
        if( isNaN(Number(id)) || Number(id)<0){
            return res.status(406).json({"meesage":"id is not acceptable"});
        }
        const user = await users.findOne({
            where: {id},
            include: [posts,comments]
        });
        if(!user){
            return res.status(400).json({"message":"User not found!"});
        }
        res.status(201).json(user);
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

module.exports = {handleRegister,getUsers,updateUser,getUser,deleteUser};