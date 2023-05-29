import { canSSRauth } from '@/utils/canSSRauth'
import React, { useContext, useState } from 'react'

import styles from './styles.module.css';

// components
import Layout from '@/components/Layout/Layout'
import PhotoItem from '@/components/PhotoItem'

import { GetServerSidePropsContext } from 'next'
import Head from 'next/head';
import Link from 'next/link';

import { setupAPIClient } from '@/services/api'

import { IPhotos } from '../users/[id]'
import LikeContainer from '@/components/LikeContainer'

import { AuthContext } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'

type Props = {
  photos: IPhotos[]
}

export default function Dashboard({photos}: Props){

  const [album, setAlbum] = useState<IPhotos[] | []>(photos)

  const { user } = useContext(AuthContext);

  const apiClient = setupAPIClient();


  const handleLink = async(_id: string) => {
    
    const res= await apiClient.put(`/api/photos/like/${_id}`)
      .then((res) => {
        toast.success("Foto curtida com sucesso")
        return res.data;
      })
      .catch((err) => {
        toast.error(err.response.data.errors[0]);
      })

    if(res.userId){
      setAlbum(album.map((photo) => {
        
        if(photo.userId === user._id){
          return photo = photo.likes.push(res.userId)
        }
        
        return photo
      }))
      
    }

  } 

  return (
    <>
      <Head>
        <title>Seja bem-vindo - React Gram</title>
      </Head>
      <article className={styles.home}>
        {album && (
          album.map((photo) => (
            <div key={photo._id}>
              <PhotoItem photo={photo} key={photo._id} />
              <LikeContainer user={user} photo={photo} handleLike={handleLink} />
              <Link className={styles.btn} href={`/photos/${photo._id}`} >Ver mais...</Link>
            </div>
            
          ))
        )}
      </article>
    </>
  )
}

export const getServerSideProps = canSSRauth(async (ctx: GetServerSidePropsContext<{}> | any) => {

  const apiClient = setupAPIClient(ctx);

  const res = await apiClient.get("/api/photos/")
    .then((res) => res.data)
  

    return {
        props: {
          photos: res
        }
    }

})