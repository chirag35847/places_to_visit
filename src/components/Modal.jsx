import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children , isModalOpen}) {
  const ref = useRef();

  useEffect(()=>{
    if (isModalOpen) {
      ref.current.showModal();
    }
    else {
      ref.current.close();
    }
  },[isModalOpen])

  return createPortal(
    <dialog className="modal" ref={ref}>
      {isModalOpen?children:null}
    </dialog>,
    document.getElementById('modal')
  );
};