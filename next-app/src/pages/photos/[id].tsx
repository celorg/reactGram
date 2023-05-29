import React, {useState,useContext,useEffect} from 'react';

import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';


import { IPhotos } from '../users/[id]';

import { canSSRauth } from '@/utils/canSSRauth';
import { setupAPIClient } from '@/services/api';

// Components
import LikeContainer from '@/components/LikeContainer';
import PhotoItem from '@/components/PhotoItem';
import { AuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

type PhotoProps = {
  photo: IPhotos
}


export default function Photo({photo}: PhotoProps) {

  const [post, setPost] = useState(photo);

  useEffect(() => {
    
  })

  const { user } = useContext(AuthContext);

  const apiClient = setupAPIClient();

  const handleLikePhoto = async(_id: string) => {
    const res = await apiClient.put("/api/photos/like/" + _id)
      .then((res) => {
        toast.success("Foto curtida com sucesso")
        return res.data
      })
      .catch((err) => {
        toast.error(err.response.data.errors[0])
      })
    
    if(res.userId){
      const updatePost = post
      updatePost.likes.push(res.userId)
      setPost(updatePost)
    }
    
    // setPost()
  }

  return (
    <>
      <Head>
        <title>Foto - React Gram</title>
      </Head>
      <article>
        {post && (
          <div>
            <PhotoItem photo={post} />
            <LikeContainer photo={post} user={user} handleLike={handleLikePhoto}  />
          </div>
        )}
        {!post && (
          <p>Foto não encontrada</p>
        )}
      </article>
    </>
  )
}

export const getServerSideProps = canSSRauth(async (ctx: GetServerSidePropsContext<{}> | any) => {

  const { id } = ctx.params;

  const apiClient = setupAPIClient(ctx);

  const res = await apiClient.get("/api/photos/perfil/" + id)

  return {
    props: {
      photo: res.data
    }
  }
})