import React, {useState} from 'react';
import {Button, Table} from 'antd';
import moment from 'moment';
import ModalPost from './ModalPost';
import Comments from './Comments';
import { GiCrossMark } from "react-icons/gi";
import ConfirmationModal from './ConfirmationModal';
import useAxiosPrivte from '../hooks/useAxiosPrivate';


const Posts = (props) => {

    
    const [postModal , setPostModal] = useState(false);
    const [post , setPost] = useState('');
    const [postId, setPostId] = useState('');
    const [commentModal , setCommentModal] = useState(false);
    const [addComment, setAddComment] = useState(false);
    const [comments, setComments] = useState([]);
    const [userPost, setUserPost] = useState(false);
    const [confirmModal ,setConfirmModal] = useState(false);

    const axiosPrivate = useAxiosPrivte();


    const openPostModal = () => {
        setPostModal(!postModal);
        if(post){
            setPost('');
        }
        if(postId){
            setPostId('');
        }
    }

    const setPostDetails = (id) => {
        setPostModal(!postModal);
        setPostId(id);
        const postToEdit = props.posts.find((post)=>(post.id === id));
        setPost(postToEdit.post);
    }

    const openCommentModal = async (id) => {
        setCommentModal(!commentModal);
        setPostId(id);
        if(id){
            const postToCheck = props.posts.find((item)=>(item.id === id));
            setUserPost(postToCheck.userId.toString() === props.userId);
        }
        if(!commentModal){
          try{
            const response = await axiosPrivate.get(`/comments/post/${id}`);
            if(Array.isArray(response.data)){
                setComments(response.data);
                return;
            }
            setComments([]);
          }catch(err){
            console.log(err);
          }
        }
    }

    const openAddComment = (id) => {
        setAddComment(!addComment);
        if(id){
            setPostId(id);
        }
    };

    const handleConfirmModal = (id) => {
        setConfirmModal(!confirmModal);
        if(!confirmModal){
        setPostId(id);
        }
    }

    const deletePost = async (postId) => {
        try{
            await axiosPrivate.delete(`/posts/${postId}`);
            const remainingPosts = props.posts.filter((post)=>(post.id !== postId));
            props.setPosts(remainingPosts);
            if(props.userProfile){
            props.setProfilePosts(remainingPosts);
            }
        }catch(err){
            console.log(err);
        }
    };

    const data = props.userProfile ? props.profilePosts.map((item)=>{return {key: item.id, ...item}}) 
    : props.posts.map((item)=>{return {key: item.id, ...item}});

    const column = [
        {
            title:'User Name',
            key: 'key',
            render: payload => {
                return payload.user.status !== 'DEACTIVATED' ? payload.user.name : 'Post_Bar User';
            }
        },
        {
            title:'Post',
            key: 'key',
            align: 'left',
            render: payload => {
                return payload.post;
            },
        },
        {
            title:'Posted at',
            key: 'key',
            align: 'center',
            render: payload => {
                let date = moment(payload.createdAt).format('MMMM Do YYYY, h:mm:ss a');
                date = moment(date,'MMMM Do YYYY, h:mm:ss a');
                if(moment().diff(date, 'days')>7){
                    return date;
                }else if(moment().diff(date, 'days')>1){
                    return `${moment().diff(date, 'days')} days ago`;
                }else if(moment().diff(date, 'days')>0){
                    return `${moment().diff(date, 'days')} day ago`;
                }else if(moment().diff(date, 'hours')>1){
                    return `${moment().diff(date, 'hours')} hours ago`;
                }else if(moment().diff(date, 'hours')>0){
                    return `${moment().diff(date, 'hours')} hour ago`;
                }else if(moment().diff(date, 'm')>1){
                    return `${moment().diff(date, 'm')} mins ago`;
                }else if(moment().diff(date, 'm')>0){
                    return `${moment().diff(date, 'm')} min ago`;
                }else if(moment().diff(date, 's')>1){
                    return `${moment().diff(date, 's')} secs ago`;
                }else{
                    return `${moment().diff(date, 's')} sec ago`;
                }
            },
        },
        {
            title:'Actions',
            key:'key',
            align: 'center',
            render: payload => {
            return payload.user.status !== 'DEACTIVATED' ?
                <div className='actionBtns'>
                    <Button type='primary' onClick={()=>(openAddComment(payload.id))}>
                        Comment on Post
                    </Button>
                    <Button onClick={()=>(openCommentModal(payload.id))}>
                        View Comments
                    </Button>
                    {(payload.userId.toString() === props.userId) &&
                        <Button onClick={()=>(setPostDetails(payload.id))}>
                            Edit Post
                        </Button>
                    }
                </div>
                : '' ;
            }
        },
        {
            key:'key',
            align: 'right',
            render: payload => {
            return payload.user.status !== 'DEACTIVATED' ?
                <div>
                    {(payload.userId.toString() === props.userId) && 
                        <button onClick={()=>(handleConfirmModal(payload.id))} className='deleteButton'>
                            <GiCrossMark />
                        </button>
                    }
                </div> 
                : '' ;
            }
        }
      ];

  return (
    <div className='posts'>
        <div className='postHeading'>
            <h2>{props.userProfile ? 'User Profile' : 'List of Posts'}</h2>
            <Button type='primary' onClick={()=>(openPostModal())}>
                Create Post
            </Button>
        </div>
        <Table
            className='postTable'
            dataSource={data}
            columns = {column}
            bordered = {true}
        />
        {postModal &&
            <ModalPost
                userId = {props.userId}
                users = {props.users}
                posts = {props.posts}
                setPosts = {props.setPosts}
                profilePosts = {props.profilePosts}
                setProfilePosts = {props.setProfilePosts}
                userProfile = {props.userProfile}
                postModal = {postModal}
                openPostModal = {openPostModal}
                postId = {postId}
                setPostId = {setPostId}
                post = {post}
                setPost = {setPost}
            />
        }
        {(commentModal || addComment) &&
            <Comments
                userId = {props.userId}
                users = {props.users}
                postId = {postId}
                comments = {comments}
                setComments = {setComments}
                commentModal = {commentModal}
                openCommentModal = {openCommentModal}
                openAddComment = {openAddComment}
                addComment = {addComment}
                setAddComment = {setAddComment}
                userPost = {userPost}
            />
        }
        {confirmModal && 
            <ConfirmationModal
                id = {postId}
                confirmModal = {confirmModal}
                setConfirmModal = {setConfirmModal}
                handleConfirmModal = {handleConfirmModal}
                deleteMethod = {deletePost}
            />
        }
    </div>
  )
}

export default Posts
