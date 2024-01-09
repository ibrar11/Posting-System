const {users} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleAuth = async (req,res) => {
    try{
        const {userName,pwd} = req.body;
        if(!userName || !pwd){
            return res.status(404).json({"message":"User name and password are required."});
        }
        const user = await users.findOne({where: {name:userName}});
        if(!user){
            return res.status(401).json({"message":"User name or password is wrong"});
        } 
        const pwdMatch = await bcrypt.compare(pwd,user.pwd);
        if(pwdMatch){
            if(user.status === 'DEACTIVATED') {
                user.status = 'ACTIVATED';
                await user.save();
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
            res.json(
                {
                    accessToken,
                    user: {
                        id: user.id
                    }
                }
            );
        }else{
            res.status(401).json({"message":"User name or password is wrong"});
        }
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

module.exports = {handleAuth};