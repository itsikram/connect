import React,{Fragment,useState} from "react";
import Modal from "react-modal";
import $ from 'jquery'

Modal.setAppElement('#root')

let ModalContainer = ({children,title,style,isOpen,onRequestClose,id,onClose},props) => {

let subtitle = title || 'Modal'

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgb(36,37,38)',
      zIndex: '99',
      maxHeight: '100%',
      ...style
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.8)",
      zIndex: '999'
    }
  };

  let closeModal  = (e) => {
    let target = e.currentTarget
  }

 

  return (
        <div>
          <Modal
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc ={true}
            style={customStyles} 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            id = {id || "profile-modal"}
          >
            {children}
          </Modal>
        </div>
      );
}

export default ModalContainer