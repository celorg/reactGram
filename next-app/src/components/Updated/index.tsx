import React, { FormEvent, useState } from 'react';

import styles from './styles.module.css';

// Components
import { InputForm, ButtonForm } from '../Form/ElementsForm';
import Modal from '../Modal';
import { FaUpload } from 'react-icons/fa';


import { uploads } from '@/pages/profile';
import { setupAPIClient } from '@/services/api';
import { toast } from 'react-toastify';

type UpdatedProps = {
    children: React.ReactNode,
    photo: PhotoProps
}

type PhotoProps = {
    titile: string,
    image: string,
    _id: string
}

export default function UpdatedPhoto ({children, photo}: UpdatedProps) {

    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const api = setupAPIClient();

    const [previewImage] = useState<File | string>(photo.image);
    const [title, setTitle] = useState(photo.titile);

    const handleModal = () => {
        setIsOpen(!isOpen);
    }

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();

        setLoading(true);

        await api.put(`/api/photos/${photo._id}`)
            .then((res) => {
                toast.success("Foto atualizada com sucesso")
                setIsOpen(false);
            })
            .catch((err) => {
                toast.error(err.response.data.errors[0])
            })

        setLoading(false);
    }

  return (
    <>
        <button onClick={(e) => setIsOpen(true)} className={styles.button}>{children}</button>
        <Modal open={isOpen} toggle={handleModal} >
            <h2>Atualizar sua foto</h2>
            <p>Apenas o título pode ser alterado</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label >
                    <span>Titulo:</span>
                    <InputForm 
                        type='text'
                        placeholder='Digite um titulo para sua foto'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <span className='label' >Adicione uma Foto</span>
                <label className={styles.box}>
                    {previewImage && (
                        <img 
                            src={`${uploads}/photos/${photo.image}`}
                            className={styles.previewImage}
                            title={photo.titile}
                            alt={photo.image}
                        />
                    )}
                </label>
                {previewImage && (
                    <ButtonForm loading={loading} >Atualizar Foto</ButtonForm>
                )}
            </form>
        </Modal>
    </>
  )
}

