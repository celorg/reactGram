import { setupAPIClient } from '@/services/api';
import { canSSRauth } from '@/utils/canSSRauth';

// Css
import styles from './styles.module.css';

// Icons
import {FiUpload} from 'react-icons/fi';

// Next
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';

// Components
import { ButtonForm, InputForm } from '@/components/Form/ElementsForm';
import { toast } from 'react-toastify'

import React,{ChangeEvent, FormEvent, useState} from 'react';

export interface IPerfilProps {
  user: IUserProps
}

export type IUserProps = {
  _id: string,
  name: string,
  email: string,
  bio: string,
  profileImage: string,
  password?: string | null
}

export const uploads = "http://localhost:5000/uploads";

export default function Perfil ({user}: IPerfilProps) {

  const [perfil, setPerfil] = useState<IUserProps>(user);
  const [previewPerfil, setPreviewPerfil] = useState<IUserProps>(user);

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<string | File>(user.profileImage);
  const [previewImage, setPreviewImage] = useState<File>();
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreviewPerfil({...previewPerfil, [e.target.name]: e.target.value})
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files){
      return;
    }
    
    const image = e.target.files[0];

    console.log(image);
    setImage(image);
    setPreviewImage(image);

  }

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
    
    setLoading(true)

    const formData = new FormData();
    // console.log(previewPerfil);

    if(previewPerfil.name !== perfil.name){
      formData.append("name", previewPerfil.name)
    }

    if(previewPerfil.bio !== perfil.bio){
      formData.append("bio", previewPerfil.bio)
    }

    if(image !== perfil.profileImage){
      formData.append("profileImage", image)
    }

    if(previewPerfil.password){
      formData.append("password", previewPerfil.password)
    }

    const apiClient = setupAPIClient();

    await apiClient.patch("/api/users", formData)
      .then((res) => {
        setImage(res.data.profileImage);
        setPerfil(res.data);
        setPreviewPerfil(res.data);
        toast.success("Perfil atualizado");
      }).catch((err) => {
        toast.error(err.response.data.errors[0])
      })


    setLoading(false);

  }

  return (
    <>
      <Head>
        <title>Edite seu perfil</title>
      </Head>
      <article className={styles.container}>
        <h2>Adicione uma image de perfil e conte mais sobre você</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.labelAvatar}>
            <span><FiUpload size={30} color="#fff" /></span>
            <input type="file" name="profileImage" accept='image/jpeg, image/png' onChange={handleFile}  />
            {(previewImage || image) && (
              <img src={previewImage ? URL.createObjectURL(previewImage) : `${uploads}/users/${image}`} />
            )}
          </label>
          <label>
            <span>Nome:</span>
            <InputForm 
              type='text'
              placeholder='Digite seu nome'
              name='name'
              value={previewPerfil?.name}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Email:</span>
            <InputForm 
              type='email'
              placeholder='Digite seu email'
              disabled
              value={previewPerfil?.email}
            />
          </label>
          <label>
            <span>Bio:</span>
            <InputForm 
              type='text'
              placeholder='Digite uma bio'
              name='bio'
              value={previewPerfil?.bio}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Deseja trocar sua senha:</span>
            <InputForm 
              type='password'
              placeholder='Digite uma nova senha'
              name='password'
              onChange={handleChange}
            />
          </label>
          <ButtonForm loading={loading} >Atualizar</ButtonForm>
        </form>
      </article>
    </>
  );
}

export const getServerSideProps = canSSRauth(async (context: GetServerSidePropsContext<{}> | any) => {

  const apiClient = setupAPIClient(context)

  const res = await apiClient.get("/api/users/profile")

  return {
    props: {
      user: res.data
    }
  }

})