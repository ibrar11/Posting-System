import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import useAuthContext from '../hooks/useAuthContext';
import useAxiosPrivte from '../hooks/useAxiosPrivate';

const UserModel = (props) => {

const [switchModal,setSwithcModal] = useState(false);
const [user, setUser] = useState(props.users.length ? props.users.find((user)=>(user.id.toString() === props.userId)).name :'');
const [pwd, setPwd] = useState('');

const axiosPrivate = useAxiosPrivte();

const { setAuth } = useAuthContext();
const navigate = useNavigate();
const location = useLocation();
let from = location?.state?.from?.pathname;

const handleSwitch = (e)=>{
    e.preventDefault();
    setUser('');
    setPwd('');
    setSwithcModal(!switchModal);
}

const handleAction = async (e)=>{
    e.preventDefault();
    try{
        if(props.updateModal){
            if(user || pwd) {
                const userToUpdate = {

                    name: user,
                    password: pwd
                }
                const response = await axiosPrivate.put(`users/${props.userId}`,userToUpdate);
                props.setUsers(props.users.map((user)=>((user.id.toString() === props.userId) ? {...response.data.user} : user)));
                const postsToUpdate = props.posts.filter((post)=>(post.user.id.toString() === props.userId));
                postsToUpdate.map((post)=>(post.user.name = user));
                setAuth({
                    id: response.data.user.id,
                    accessToken: response.data.accessToken
                })
                setUser('');
                setPwd('');
                props.setUpdateModal(false);
            }
            return;
        }
        if(switchModal){
            if(user || pwd){
                const newUser = {
                    userName: user,
                    pwd
                }
                const response = await axiosPrivate.post('users',newUser);
                setUser('');
                setPwd('');
                const message = response.data.message;
                alert(message);
            }
        }else{
            if(user || pwd){
                const userToLog = {
                    userName: user,
                    pwd
                }
                const response = await axiosPrivate.post('auth',userToLog);
                const result = await axiosPrivate.get(`users`);
                props.setUsers(result.data);
                setAuth({
                    id: response.data.user.id,
                    accessToken: response.data.accessToken
                })
                localStorage.setItem("user", response.data.user.id);
                setUser('');
                setPwd('');
                if(!from) {
                    from = `/feed/${response.data.user.id}`;
                }
                navigate(from, {replace: true});
            }
        }
    }catch(err){
        const condition = err.response && (err.response.status === 409 || err.response.status === 401);
        if(condition){
            const message = err.response.data.message;
            alert(message);
            setUser('');
            setPwd('');
        }else{
            console.log(err);
        }
    }
}

const closeUpdateModal = (e) => {
    e.preventDefault();
    props.setUpdateModal(false);
}


  return (
    <div className={props.updateModal ? 'formContainer2' :'formContainer'}>
        <form className='form' onSubmit={handleAction}>
        <h1>
            {props.updateModal ? 'Change User Info' : !switchModal ? 'Log into Account' : 'Create Account'}
        </h1>
        <input 
            id='user'
            className='inputField'
            placeholder={props.updateModal ? 'Enter new username' :'Enter username'}
            required
            value={user}
            onChange={(e)=>(setUser(e.target.value))}
        />
        <input 
            id='password'
            className='inputField'
            placeholder={props.updateModal ? 'Enter new password' :'Enter Password'}
            required = {props.updateModal ? false : true}
            type='password'
            value={pwd}
            onChange={(e)=>(setPwd(e.target.value))}
        />
        <button
            type='submit'
            className='button'
        >
            {props.updateModal ? 'Update Details' : !switchModal ? 'Log In' : 'Sign Up'}
        </button>
        <div className='secondaryBtn'>
            {!props.updateModal && <button onClick={(e)=>handleSwitch(e)} type='button' className='switchBtn'>
                {!switchModal ? 'Register New User' : 'Already has an account?'}
            </button>}
            {props.updateModal &&
                <button onClick={(e)=>closeUpdateModal(e)} type='button' className='cancelBtn'>
                    Cancel
                </button>
            }
        </div>
        </form>
    </div>
  )
}

export default UserModel;
