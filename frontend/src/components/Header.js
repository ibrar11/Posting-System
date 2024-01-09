import { Modal } from "antd";
import { useState} from "react"
import Posts from "./Posts";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate } from "react-router";
import useAxiosPrivte from "../hooks/useAxiosPrivate";
import ConfirmationModal from "./ConfirmationModal";

const Header = (props) => {


    const [profilePosts , setProfilePosts] = useState([]);
    const [userProfile , setUserProfile] = useState(false);
    const [confirmModal ,setConfirmModal] = useState(false);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivte()
    const { setAuth } = useAuthContext();


    const openUpdateModal = () => {
        props.setUpdateModal(true);
    }

    const openUserProfile = () => {
        setUserProfile(!userProfile);
        if(props.posts){
            const userPosts = props.posts.filter((post)=>(post.user.id.toString() === props.userId));
            setProfilePosts(userPosts);
            return;
        }
    }

    const logOut = async () => {
        try{
            await axiosPrivate.get("/logout");
            props.setUsers([]);
            setAuth('');
            localStorage.clear();
            navigate('/');
        }catch(err){
            console.log(err);
        }
    }

    const deactivate = async (id) => {
        try{
            await axiosPrivate.delete(`/users/${id}`);
            logOut();
        }catch(err){
            console.log(err);
        }
    }

    const handleConfirmModal = () => {
        setConfirmModal(!confirmModal);
    }

  return (
    <div className='header'>
        <h2>
            Post_Bar
        </h2>
        <nav className='navBar'>
            <div className='navContainer'>
                <p>
                    <button 
                        onClick={()=>(openUserProfile())}
                        className="nameButton"
                    >
                        {props.users.length ? props.users.find((user)=>(user.id.toString() === props.userId)).name : ''}
                    </button>
                </p>
                <div className='btnContainer'>
                    <button className='navBtn' onClick={()=>(logOut())}>
                        Log Out
                    </button>
                    <button className='navBtn' onClick={()=>(openUpdateModal())}>
                        Change Info
                    </button>
                    <button className='navBtn' onClick={()=>(handleConfirmModal())}>
                        Delete Account
                    </button>
                </div>
            </div>
        </nav>
        {userProfile &&
            <Modal
                centered
                open = {true}
                footer = {null}
                width= {1200}
                height = {650}
                onCancel={openUserProfile}
                destroyOnClose= {true}
            >
                <Posts
                    userId = {props.userId}
                    profilePosts = {profilePosts}
                    setProfilePosts = {setProfilePosts}
                    users = {props.users}
                    posts = {props.posts}
                    setPosts = {props.setPosts}
                    userProfile = {userProfile}
                />
            </Modal>
        }
        {confirmModal && 
            <ConfirmationModal
                id = {props.userId}
                confirmModal = {confirmModal}
                setConfirmModal = {setConfirmModal}
                handleConfirmModal = {handleConfirmModal}
                deleteMethod = {deactivate}
            />
        }
    </div>
  )
}

export default Header
