import React from 'react';
import {Input, Modal,Button} from 'antd';
import useAxiosPrivte from '../hooks/useAxiosPrivate';


const ModalPost = (props) => {

    const axiosPrivate = useAxiosPrivte();
   

    const handlePost = async () => {
        try{
            if(!props.postId){
                const postToAdd = {
                    post: props.post,
                    userId: props.userId
                };
                const response = await axiosPrivate.post("/posts",postToAdd);
                const userToInclude = props.users.find((user)=>(user.id.toString() === props.userId));
                response.data.user = userToInclude;
                props.setPosts([...props.posts,response.data]);
                if(props.userProfile){
                    props.setProfilePosts([...props.profilePosts,response.data]);
                }
                props.setPost('');
                props.openPostModal();
                return;
            }
            const response = await axiosPrivate.put(`/posts/${props.postId}`,{post:props.post});
            if(response.status === 201){
                const postToEdit = props.posts.find((post)=>(post.id === props.postId));
                postToEdit.post = props.post;
                props.setPosts(props.posts.map((post)=>(post.id === props.postId ? postToEdit : post)));
                if(props.userProfile){
                props.setProfilePosts(props.profilePosts.map((post)=>(post.id === props.postid ? postToEdit : post)));
                }
            }
            props.setPostId('');
            props.openPostModal();
        }catch(err){
            console.log(err);
        }
    }

  return (
    <div className='postModal'>
      <Modal
            title={props.postId ? "Edit Post" : "Create Post"}
            centered
            open = {props.postModal}
            footer = {null}
            width= {600}
            height = {400}
            onCancel={props.openPostModal}
            destroyOnClose= {true}
        >
            <Input.TextArea
                id='postField'
                style={{ height: 200, resize: 'none'}}
                required = {true}
                value={props.post}
                onChange={(e)=>(props.setPost(e.target.value))}
            />
            <Button type='primary' onClick={()=>(handlePost())} disabled = {props.post ? false : true}>
                {props.postId ? 'Save Changes' :'Submit'}
            </Button>
        </Modal>
    </div>
  )
}

export default ModalPost
