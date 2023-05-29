import React from 'react'

import styles from './styles.module.css';

import Link from 'next/link';

import { IPhotos } from '@/pages/users/[id]';
import { uploads } from '@/pages/profile';

type PhotoProps = {
    photo: IPhotos
}

export default function PhotoItem({photo}: PhotoProps) {

  return (
    <div className={styles.photo_item}>
        {photo.image && (
            <img src={`${uploads}/photos/${photo.image}`} alt={photo.userName} />
        )}
        <h2>{photo.titile}</h2>
        <p className={styles.photo_author}>
            publicada por: <Link href={`/users/${photo.userId}`}>{photo.userName}</Link>
        </p>
    </div>
  )
}

 PhotoItem