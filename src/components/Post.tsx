import { Send } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { db } from '../firebase'
import styles from './Post.module.css'

interface Props {
  postId: string
  avatar: string
  image: string
  text: string
  timestamp: any
  username: string
}

interface Comment {
  id: string
  avatar: string
  text: string
  timestamp: any
  username: string
}

const Post: React.FC<Props> = (props) => {
  const user = useSelector(selectUser)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '',
      avatar: '',
      text: '',
      username: '',
      timestamp: null,
    },
  ])

  // Fetch Comment
  useEffect(() => {
    const q = query(
      collection(db, 'posts', props.postId, 'comments'),
      orderBy('timestamp', 'desc')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          avatar: doc.data().avatar,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
          username: doc.data().username,
        }))
      )
    })

    console.log(comments)

    return () => {
      unsubscribe()
    }
  }, [props.postId])

  const newComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await addDoc(collection(db, 'posts', props.postId, 'comments'), {
      avatar: user.photoUrl,
      text: comment,
      timestamp: serverTimestamp(),
      username: user.displayName,
    })

    setComment('')
  }

  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={props.avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{props.username}</span>
              <span className={styles.post_headerTime}>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{props.text}</p>
          </div>
        </div>
        {props.image && (
          <div className={styles.post_tweetImage}>
            <img src={props.image} alt="post" />
          </div>
        )}

        {comments.map((com) => (
          <div key={com.id} className={styles.post_comment}>
            <Avatar
              src={com.avatar}
              className={styles.post_comment_avatar_small}
            />

            <span className={styles.post_commentUser}>@{com.username}</span>
            <span className={styles.post_commentText}>{com.text}</span>
            <span className={styles.post_headerTime}>
              {new Date(com.timestamp?.toDate()).toLocaleString()}
            </span>
          </div>
        ))}

        <form onSubmit={newComment}>
          <div className={styles.post_form}>
            <input
              className={styles.post_input}
              type="text"
              placeholder={'コメントを入力...'}
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
            />
            <button
              disabled={!comment}
              className={
                comment ? styles.post_button : styles.post_buttonDisable
              }
              type="submit"
            >
              <Send className={styles.post_sendIcon}></Send>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Post
