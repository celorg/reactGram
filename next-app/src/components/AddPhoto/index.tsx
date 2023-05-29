import React, { ChangeEvent, FormEvent, useState } from 'react'

import styles from './styles.module.css';

// Componentes
import { InputForm,ButtonForm } from '../Form/ElementsForm';
import Modal from '../Modal';
import {toast} from 'react-toastify';

// Icons
import { FaUpload } from 'react-icons/fa';

import { IUserProps } from '@/pages/profile';
import { setupAPIClient } from '@/services/api';

type AddPhotoProps = {
    children: React.ReactNode;
    user: IUserProps;
    filter: () => void;
}

export default function AddPhoto({children,user,filter}: AddPhotoProps) {

    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [title , setTitle] = useState('');
    const [previewImage, setPreviewImage] = useState<File>();

    const handleModal = () => {
        setIsOpen(!isOpen);
    }

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0]

        setPreviewImage(image);
    }

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();

        setLoading(true);

        if(!title){
            toast.warning("Adicione um título");
            return;
        }

        if(!previewImage){
            toast.warning("Adicione uma image");
            return;
        }

        const formData = new FormData();

        formData.append('title', title);
        formData.append('image', previewImage);

        const apiClient = setupAPIClient();

        await apiClient.post("/api/photos/" , formData)
            .then((res) => {
                setPreviewImage(undefined);
                setTitle('');
                setIsOpen(false);
                toast.success("Foto adicionada com sucesso");
                filter();
            }).catch((err: any) => {
                toast.error(err.response.data.errors[0])
                setLoading(false)
            })

        setLoading(false);
    }

  return (
    <>
        <button onClick={handleModal} className={styles.button}>{children}</button>
        <Modal open={isOpen} toggle={handleModal}>
            <h2>Adicione uma foto</h2>
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
                <label className={previewImage ? styles.box : styles.boxImage }>
                    <span><FaUpload size={60} /></span>
                    <input type="file" name="image" accept='image/jpeg, image/png' onChange={handleFile} />
                    {previewImage && (
                        <img 
                            src={URL.createObjectURL(previewImage)}
                            className={styles.previewImage}
                            title={user.name}
                            alt={user.name}
                        />
                    )}
                </label>
                {previewImage && (
                    <ButtonForm loading={loading} >Adicionar Foto</ButtonForm>
                )}
            </form>
        </Modal>
    </>
    
  )
}