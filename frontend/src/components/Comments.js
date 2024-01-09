import { Modal, Table, Button, Input } from 'antd';
import React, { useState } from 'react'
import moment from 'moment'
import ConfirmationModal from './ConfirmationModal';
import { GiCrossMark } from "react-icons/gi";
import useAxiosPrivte from '../hooks/useAxiosPrivate';


const Comments = (props) => {

  const [comment, setComment] = useState('');
  const [c_id, setC_Id] = useState('');
  const [confirmModal ,setConfirmModal] = useState(false);

  const axiosPrivate = useAxiosPrivte();


  const data = props.comments.map((comment)=>({...comment,key:comment.id}));

  const handleComment = async () => {
    try {
      if(!c_id){
        const commentToPost = {
          comment,
          userId: props.userId,
          postId: props.postId
        };
        const response = await axiosPrivate.post("/comments",commentToPost);
        const userToInclude = props.users.find((user)=>(user.id.toString() === props.userId));
        response.data.user = userToInclude;
        props.setComments([...props.comments,response.data]);
        setComment('');
        props.openAddComment();
        return;
      }
      const response = await axiosPrivate.put(`/comments/${c_id}`,{comment});
      if(response.status === 201){
          const commentToEdit = props.comments.find((item)=>(item.id === c_id));
          commentToEdit.comment = comment;
          props.setComments(props.comments.map((item)=>(item.id === c_id ? commentToEdit : item)));
      }
      setC_Id('');
      setComment('');
      props.openAddComment();
    }catch (err) {
      console.log(err);
    }
  };

  const handleConfirmModal = (id) => {
    setConfirmModal(!confirmModal);
    if(!confirmModal){
    setC_Id(id);
    }
}

  const deleteComment = async (id) => {
    try{
        await axiosPrivate.delete(`/comments/${id}`);
        const remainingComments = props.comments.filter((item)=>(item.id !== id));
        props.setComments(remainingComments);
    }catch(err){
        console.log(err);
    }
};

  const openEditComment = (id) => {
    const commentToEdit = props.comments.find((item)=>(item.id === id));
    setC_Id(id);
    setComment(commentToEdit.comment);
    props.setAddComment(true);
  };

  const columns = [
    {
      title: 'PostId',
      key:'key',
      dataIndex: 'postId'
    },
    {
      title: 'User',
      key:'key',
      render: payload => {
        return payload.user.name;
      }
    },
    {
      title:'Comment',
      key:'key',
      dataIndex:'comment'
    },
    {
      title:'Posted',
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
        return <div className='actionBtns'>
            {payload.userId.toString() === props.userId &&
              <Button type='primary' onClick={()=>(openEditComment(payload.id))}>
                Edit Comment
              </Button>
            }
        </div>
        }
    },
    {
      key:'key',
      align: 'right',
      render: payload => {
      return ( 
      <div>
          {(payload.userId.toString() === props.userId) && 
              <button onClick={()=>(handleConfirmModal(payload.id))} className='deleteButton'>
                  <GiCrossMark />
              </button>
          }
      </div> )
      }
  }
  ]

  return (
    <div className='commentModal'>
      <Modal
        title = 'Post Comments'
        centered
        open = {props.commentModal}
        width={1000}
        height = {650}
        footer = {null}
        onCancel={()=>(props.openCommentModal())}
        destroyOnClose= {true}
      >
        <div className='commentBtn'>
          <Button type='primary' onClick={()=>(props.openAddComment())}>Comment on Post</Button>
        </div>
        <Table
        dataSource={data}
          columns={columns}
        />
      </Modal>
        <Modal
          title = {c_id ? 'Edit Comment' : 'Add Comment'}
          centered
          open = {props.addComment}
          width={600}
          height = {350}
          footer = {null}
          onCancel={props.openAddComment}
          destroyOnClose= {true}
        >
          <Input.TextArea
                id='postField'
                style={{ height: 60, resize: 'none'}}
                required = {true}
                value={comment}
                onChange={(e)=>(setComment(e.target.value))}
            />
            <Button type='primary' onClick={()=>(handleComment())}>
            {c_id ? 'Save Changes' : 'Submit'}
            </Button>
        </Modal>
        {confirmModal && 
            <ConfirmationModal
                id = {c_id}
                confirmModal = {confirmModal}
                setConfirmModal = {setConfirmModal}
                handleConfirmModal = {handleConfirmModal}
                deleteMethod = {deleteComment}
            />
        }
    </div>
  )
}

export default Comments;
