import React, { useState } from 'react';

import styles from './styles.module.css';

import {MdClose} from 'react-icons/md';

type ModalProps = {
    children: React.ReactNode,
    open: boolean,
    toggle: () => void
}

export default function Modal({children, open, toggle}: ModalProps) {

  return (
    <>
        {open && (
            <div className={styles.container} onClick={toggle}>
                <div className={styles.box} onClick={(e) => e.stopPropagation()}>
                    <div onClick={toggle} className={styles.close}><MdClose size={30} color="#ff0000" /></div>
                    {children}
                </div>
            </div>
        )}
        
    </>
  )
}
