const {users,posts,comments} = require('../models');

const generateComment = async (req,res) => {
    try{
        const {comment,userId,postId} = req.body;
        const user = await users.findOne({where:{id:userId}});
        const post = await posts.findOne({where:{id:postId}});
        const condition = (comment && user && post);
        if(!condition){
            return res.status(400).json({"message":"User id, post id and comment are required"});
        }
        const response = await comments.create({comment,userId,postId});
        return res.status(201).json(response);
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const getComments = async (req,res) => {
    try{
        const allComments = await comments.findAll({include: [users,posts]});
        if(allComments.length === 0){
            return res.status(200).json({"message":"No comment to show"});
        }
        res.status(200).json(allComments); 
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const getComment = async (req,res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({"message":"No comment to show"});
        }
        if( isNaN(Number(id)) || Number(id)<0){
            return res.status(406).json({"message":"id is not acceptable"});
        }
        const comment = await comments.findOne({
            where: {id},
            include: [users,posts]
        });
        if(!comment){
            return res.status(400).json({"message":`Did not find comment with id ${id}`});
        }
        res.status(200).json(comment); 
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const getPostComments = async (req,res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(404).json({"message":"PostId is missing"});
        }
        const postComments = await comments.findAll({
            where: {postId: id},
            include: users
        });
        res.status(200).json(postComments);
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const getUserComments = async (req,res) => {
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(404).json({"message":"UserId is missing"});
        }
        const userComments = await comments.findAll({
            where: {userId},
            include: posts
        })
        if(!userComments.length){
            return res.status(404).json({"message":`Did not found any comment against post Id ${userId}`});
        }
        res.status(200).json(userComments);
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const updateComment = async (req,res) => {
    try{
        const {id} = req.params;
        const {comment} = req.body;
        if(!id){
            return res.status(400).json({"message":"Comment id is not found!"});
        } 
        if(isNaN(Number(id)) || Number(id)<0){
            return res.status(406).json({"message":"id is not acceptable"});
        }
        const commentToEdit = await comments.findOne({
            where: {id}
        });
        if(!commentToEdit){
            return res.status(400).json({"message":"Post not found!"});
        }
        commentToEdit.comment = comment;
        await commentToEdit.save();
        res.status(201).json({"message":"Comment updated"});
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const deleteComment = async (req,res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({"message":"Comment id is not found!"});
        }
        if(isNaN(Number(id)) || Number(id)<0){
            return res.status(406).json({"message":"id is not acceptable"});
        }
        const comment = await comments.findOne({
            where: {id}
        });
        if(!comment){
            return res.status(400).json({"message":"Comment not found!"});
        }
        await comment.destroy();
        res.status(201).json({"message":"Comment deleted"});
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

module.exports = {generateComment,getComments,getComment,updateComment,deleteComment,getPostComments,getUserComments}