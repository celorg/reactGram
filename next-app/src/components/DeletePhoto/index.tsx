import React, { useState } from 'react';

import Modal from '../Modal';

import styles from './styles.module.css';
import { setupAPIClient } from '@/services/api';
import { toast } from 'react-toastify';

type DeleteProps = {
    children: React.ReactNode,
    id: string,
    userAuth: string,
    filter: () => void;
}

export default function DeletePhoto({children, id, userAuth, filter}: DeleteProps){

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    }

    const apiClient = setupAPIClient();

   
    const handleDelete = async() => {
        
        
        await apiClient.delete(`/api/photos/${id}`)
            .then(() => {
                toast.success("Foto removida com sucesso")
                setOpen(false);
                filter();
            })
            .catch((err) => {
                toast.error(err.response.data.errors[0]);
                setOpen(false)
            })
        
        

    }

  return (
    <>
        <button onClick={() => handleOpen()} className={styles.buttonIcon} >{children}</button>
        <Modal open={open} toggle={handleOpen} >
            <div>
                <h2>Tem certeza?</h2>
                <p>Tem certeza que deseja excluir sua foto? Aperte o botão de 'Confirmar' para apagar definitivamente essa image.</p>
                <div className={styles.divButton}>
                    <button onClick={() => handleOpen()} className={styles.cancel}>Cancelar</button>
                    <button onClick={() => handleDelete()} className={styles.confirm}>Confirmar</button>
                </div>
            </div>
        </Modal>
    </>
  )
}

