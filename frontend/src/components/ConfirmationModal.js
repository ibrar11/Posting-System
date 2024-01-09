import { Button, Modal } from 'antd'
import React from 'react'

const ConfirmationModal = (props) => {

    const deleteMethod = () => {
        props.deleteMethod(props.id);
        props.handleConfirmModal();
    }

  return (
    <div>
        <Modal
            centered
            open = {props.confirmModal}
            footer = {null}
            width= {600}
            height = {300}
            onCancel={()=>(props.handleConfirmModal())}
            destroyOnClose= {true} 
        >
            <div className='confirmModal'>
                <div className='msgContainer'><p>Are you sure, you want to delete?</p></div>
                <div className='confirmBtnContainer'>
                    <div className='confirmBtns'>
                        <Button onClick={()=>(props.handleConfirmModal())}>No</Button>
                        <Button type='primary' onClick={()=>(deleteMethod())}>Yes</Button>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
  )
}

export default ConfirmationModal
