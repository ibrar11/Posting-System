import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'

const Unauthorized = () => {

    const navigate = useNavigate();

    const goToHome = () => {
        const userId = localStorage.getItem('user');
        if(!userId){
            navigate('/');
        } else {
            navigate(`/feed/${userId}`)
        }
    }

  return (
    <div className='unauthorized'>
       <div className="404Container">
        <h2 className='msgHeader'>Oops!</h2>
        <p className='msgTxt'>404 - PAGE NOT FOUND</p>
        <div className='homeButton'>
            <Button type='primary' onClick={()=>(goToHome())}>Go to Home</Button>
        </div>
       </div>
    </div>
  )
}

export default Unauthorized
