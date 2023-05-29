import { IPhotos } from '@/pages/users/[id]';

import styles from './styles.module.css';

import React, {useState} from 'react'
import { BsHeart, BsHeartFill } from 'react-icons/bs'

type LikeProps = {
    photo: IPhotos,
    user: UserProps,
    handleLike: (_id: string) => Promise<void>
}

type UserProps = {
    _id: string,
    name: string,
    email: string
}

export default function LikeContainer ({photo,user,handleLike}: LikeProps){

    const [post, setPost] = useState(photo)

    console.log(post)

    const disptachLike = () => {
        handleLike(photo._id)
        
        const updatePost = photo
        updatePost.likes.push(user._id)

        setPost(updatePost)
    }

  return (
    <div className={styles.like}>
        {post && user._id && (
            <>
                {post.likes.includes(user._id) ? (
                    <BsHeartFill size={25} />
                ) : (
                    <BsHeart size={25} onClick={() => disptachLike()} />
                )}
                <p>{post.likes.length} like(s)</p>
            </>
        )}
    </div>
  )
}

