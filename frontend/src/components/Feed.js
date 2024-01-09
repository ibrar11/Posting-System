import React, { useState , useEffect } from 'react'
import Header from './Header'
import { useNavigate, useParams } from 'react-router'
import UserModel from "./UserModel";
import Posts from './Posts';
import useAxiosPrivte from '../hooks/useAxiosPrivate';

const Feed = (props) => {
    const {id} = useParams();


    const [updateModal , setUpdateModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const axiosPrivate = useAxiosPrivte();
    const navigate = useNavigate();


  useEffect(()=>{
    const fetchPosts = async () => {
      try{
        const userId = localStorage.getItem('user');
        const condition = !userId || userId !== id;
        if(condition) {
          navigate('/unauthorized');
        }
        const result = await axiosPrivate.get("/posts");
        if(Array.isArray(result.data)){
          setPosts(result.data);
        }else{
          setPosts([]);
        }
        const res = await axiosPrivate.get("/users");
        if(Array.isArray(res.data)){
          props.setUsers(res.data);
        }else{
          props.setUsers([]);
        }
      }catch(err){
        console.log(err.message);
      }
      
    }
    fetchPosts();
    // eslint-disable-next-line
  },[])

  return (
    <div className='feed'>
      {id && <Header
        userId = {id}
        users = {props.users}
        setUsers = {props.setUsers}
        setUpdateModal = {setUpdateModal}
        posts = {posts}
        setPosts = {setPosts}
      />}
      {updateModal && 
        <UserModel 
            userId = {id}
            updateModal = {updateModal}
            setUpdateModal = {setUpdateModal}
            users = {props.users}
            setUsers = {props.setUsers}
            posts = {posts}
            setPosts = {setPosts}
        />
      }
      <Posts
        userId = {id}
        users = {props.users}
        posts = {posts}
        setPosts = {setPosts}
      />
    </div>
  )
}

export default Feed
