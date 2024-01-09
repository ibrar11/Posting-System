import { useEffect } from 'react';
import UserModel from './UserModel';
import useAxiosPrivte from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router';

const Registration = (props) => {

  const axiosPrivate = useAxiosPrivte();
  const navigate = useNavigate();

  useEffect(()=>{
      const tokenCheck = async () => {
        try{
          const response = await axiosPrivate.get('/users');
          if(Array.isArray(response.data) && localStorage.getItem('user')){
            const userId = localStorage.getItem('user');
            navigate(`/feed/${userId}`);
          }
        }catch (err){
          navigate('/');
        }
      }
      tokenCheck();
      // eslint-disable-next-line
  },[])

  return (
    <div className='registerPage'>
      <UserModel
        users = {props.users}
        setUsers = {props.setUsers}
      />
    </div>
  )
}

export default Registration;
