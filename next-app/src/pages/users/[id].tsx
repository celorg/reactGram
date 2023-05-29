import React, { useState, useContext, useEffect } from 'react'

import styles from './styles.module.css';

// Next
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths, GetStaticPathsContext, GetStaticProps, GetStaticPropsContext, GetStaticPropsResult, NextPageContext } from 'next';
import Link from 'next/link';
import Head from 'next/head';

// icons
import {FcPlus,FcSettings} from 'react-icons/fc';
import { HiPencilSquare } from 'react-icons/hi2';
import { BsFillEyeFill,BsPencilFill,BsXLg,BsPlusSquareFill } from 'react-icons/bs';

// Utils
import { setupAPIClient } from '@/services/api';
import { parseCookies } from 'nookies';
import { AuthContext } from '@/contexts/AuthContext';


// components
import AddPhoto from '@/components/AddPhoto';
import { IUserProps, uploads } from '../profile';
import DeletePhoto from '@/components/DeletePhoto';
import UpdatedPhoto from '@/components/Updated';


const api = "http://localhost:5000"

type Props = {
    user: IUserProps,
    photos: IPhotos[]
}

export type IPhotos = {
    image: string,
    titile: string,
    likes: any,
    comments: any,
    userId: string,
    userName: string,
    _id: string
}

export type ILikes = {
    _id: string
}


export default function Users({user,photos}: Props) {

    const [perfil] = useState<IUserProps>(user);

    const [album, setAlbum] = useState<IPhotos[] | []>(photos);
    const [updated, setUpdated] = useState(false);

    const { user: userAuth } = useContext(AuthContext);

    const router = useRouter();

    const id = router.query.id;

    const apiClient = setupAPIClient();

    useEffect(() => {

        const getPhotos = async() => {
            const res = await apiClient(`/api/photos/user/${user._id}`)
                .then((res) => res.data)

            setAlbum(res)
        }

        getPhotos();
        setUpdated(false);

    },[updated])


    const handleFilter = () => {
        setUpdated(true);
    }


  return (
    <>
        <Head>
            <title>Perfil - React Gram</title>
        </Head>

        <article className={styles.container}>
            <div className={styles.header}>
                <div className={styles.divImage}>
                    {perfil.profileImage && (
                        <img 
                            src={`${uploads}/users/${perfil.profileImage}`}
                            alt={perfil.name}
                            title={perfil.name}
                            className={styles.imgPerfil}
                        />
                    )}
                </div>
                
                <div className={styles.infoPerfil}>
                    <h4>{perfil.name}</h4>
                    {perfil.bio && (
                        <div className={styles.bioContainer}>
                            {/* <span>Bio:</span> */}
                            <p>{perfil.bio}</p>
                        </div>
                        
                    )}
                    {id === userAuth._id && (
                        <div className={styles.containerActions}>
                            <AddPhoto user={user} filter={handleFilter} ><BsPlusSquareFill color='#fff'  size={40} title='Adicionar foto' /></AddPhoto>
                            <Link href="/profile"><HiPencilSquare size={50} title='Editar Perfil' /></Link>
                        </div>
                    )}
                    
                </div>
                {/* <Modal >Teste</Modal> */}
            </div>
            
            <div className={styles.user_fotos}>
                <h2>Fotos Publicadas</h2>
                <div className={styles.photos_container}>
                    {album && (
                        album.map((photo) => (
                            <div className={styles.photo} key={photo._id}>
                                {photo.image && (
                                    <img 
                                        src={`${uploads}/photos/${photo.image}`} 
                                        alt={photo.userName}
                                        title={photo.userName} 
                                    />
                                )}

                                {userAuth._id === id ? (
                                    <div className={styles.actionsPhoto}>
                                        <Link href={`/photos/${photo._id}`}>
                                            <BsFillEyeFill color='#fff' size={18} />
                                        </Link>
                                        <UpdatedPhoto photo={photo} key={photo._id}><BsPencilFill color='#fff' size={18} /></UpdatedPhoto>
                                        <DeletePhoto id={photo._id} userAuth={userAuth._id} filter={handleFilter}><BsXLg color='#fff' size={18} /></DeletePhoto> 
                                  </div>
                                ) : (
                                    <div className={styles.divButton}>
                                        <Link href={`/photos/${photo._id}`} className={styles.btn}>Ver mais</Link>
                                    </div>
                                    
                                )}

                            </div>  
                        ))
                    )}
                    {!photos && <p>Ainda não há nenhuma foto publicada</p>}
                </div>
            </div>

        </article>
    </>
    )
  
}

export const getStaticPaths: GetStaticPaths =  async() => {

    const res = await fetch(`${api}/api/users/`)

    const data = await res.json();

    const paths = data.user.map((user: IUserProps) => {

        return {
            params: {
                id: user._id
            }
        }
    })

    return {
        paths,
        fallback: false
    } 

}


export const getStaticProps:GetStaticProps =  async (context: GetStaticPropsContext | any) => {

    const { id } = context.params;

    const apiClient = setupAPIClient(context)

    const res = await apiClient.get(`${api}/api/users/${id}`);

    const data = await res.data;

    return {
        props: {
            user: data.user,
            photos: data.photos
        }
    }

}