const {posts,users,comments} = require('../models');

const createPost = async (req,res) =>{
    try{
        const {post,userId} = req.body;
        if (!userId) {
            return res.status(400).json({"message":"Cannot create post without user userId"});
        }
        if( isNaN (Number(userId)) || Number(userId)<0) {
            return res.status(406).json({"message":"userId is not acceptable"});
        }
        const user = await users.findOne ( {where:{ id:userId } } );
        if (user.status === 'DEACTIVATED') {
            return res.status(409).json( {"message":"User account has been deactivated"} );
        }
        const postResponse = await posts.create({post, userId});
        res.status(201).json(postResponse);
    }catch (err) {
        res.status(500).json({"message":err.message});
    }
};

const getPosts = async (req,res) => {
        try {
            const allPosts = await posts.findAll({include: [users,comments]});
            if (allPosts.length === 0) {
                return res.status(200).json({"message":"No post to show"});
            }
            res.status(200).json(allPosts); 
        }catch (err) {
            res.status(500).json({"message":err.message});
        }
};

const getUserPosts = async (req,res) => {
    try {
        const {userId} = req.body;
        if(!userId) {
            return res.status(404).json({"message":"UserId is missing"});
        }
        const userPosts = await posts.findAll ({
            where: {userId},
            include: comments
        })
        if(!userPosts.length) {
            return res.status(404).json({"message":`Did not found any post against user Id ${userId}`});
        }
        res.status(200).json(userPosts);
    }catch(err) {
        res.status(500).json({"message":err.message});
    }
};

const getPost = async (req,res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({"message":"Cannot find post id"});
        }
        if( isNaN(Number(id)) || Number(id)<0) {
            return res.status(406).json({"message":"id is not acceptable"});
        }
        const post = await posts.findOne ({
            where: {id},
            include: comments
        });
        if(!post) {
            return res.status(400).json({"message":"Did not find any post"});
        }
        res.status(200).json(post); 
    }catch(err) {
        res.status(500).json({"message":err.message});
    }
};

const updatePost = async (req,res) => {
    try {
        const {id} = req.params;
        const {post} = req.body;
        if(!id) {
            return res.status(400).json({"message":"Post id is not found!"});
        } 
        if (isNaN(Number(id)) || Number(id)<0) {
            return res.status(406).json({"message":"id is not acceptable"});
        }
        const postToEdit = await posts.findOne ({
            where: {id}
        });
        if(!postToEdit) {
            return res.status(400).json({"message":"Post not found!"});
        }
        postToEdit.post = post;
        await postToEdit.save();
        res.status(201).json({"message":"Post updated"});
    }catch(err) {
        res.status(500).json({"message":err.message});
    }
};

const deletePost = async (req,res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({"message":"Post id is not found!"});
        }
        if(isNaN(Number(id)) || Number(id)<0) {
            return res.status(406).json({"message":"id is not acceptable"});
        }
        const post = await posts.findOne ({
            where: {id}
        });
        if(!post) {
            return res.status(400).json({"message":"Post not found!"});
        }
        await post.destroy();
        res.status(201).json({"message":"Post deleted"});
    }catch(err) {
        res.status(500).json({"message":err.message});
    }
};

module.exports = {createPost,getPosts,getPost,updatePost,deletePost,getUserPosts};