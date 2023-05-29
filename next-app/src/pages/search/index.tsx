import React, { useContext, useEffect, useState } from 'react'

import styles from './styles.module.css';

import { canSSRauth } from '@/utils/canSSRauth'

import { GetServerSidePropsContext, } from 'next'
import { useRouter } from 'next/router'


import { setupAPIClient } from '@/services/api';

// Components
import PhotoItem from '@/components/PhotoItem';
import LikeContainer from '@/components/LikeContainer';
import { toast } from 'react-toastify';

import { IPhotos } from '../users/[id]';
import { AuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import Head from 'next/head';

export default function SearchQuery(){

  const router = useRouter();

  const {q: search} = router.query;

  const [photos, setPhotos] = useState<IPhotos[] | []>([]);

  const { user } = useContext(AuthContext);

  const apiClient = setupAPIClient();

  const handleSearch = async() => {
    await apiClient.get(`/api/photos/search?q=${search}`)
      .then((res) => {
        setPhotos(res.data)
      })
      .catch((err) => {
        toast.error(err.response.data.errors[0])
      })
  }

  useEffect(() => {
    handleSearch();
  }, [search]);


  return (
    <>
      <Head>
        <title>Pesquisar Foto - ReactGram</title>
      </Head>
    
      <article className={styles.search}>
        <h2>Você está buscando por: {search}</h2>
        {photos && (
          photos.map((photo) => (
            <div key={photo._id}>
              <PhotoItem photo={photo} key={photo._id} />
              <Link className={styles.btn} href={`/photos/${photo._id}`}>Ver mais</Link>
            </div>
          ))
        )}
        {photos.length === 0 && (
          <p>Nenhuma foto foi encontrada!!</p>
        )}
      </article>
    </>
  )
}

export const getServerSideProps = canSSRauth(async (context: GetServerSidePropsContext<{}> | any) => {

  return {
    props: {}
  }

})