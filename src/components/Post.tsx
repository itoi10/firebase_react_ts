
import { Send } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { db } from '../firebase';
import styles from './Post.module.css';

interface Props {
  postId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp:any;
  username: string;
}

const Post:React.FC<Props>= (props) => {
  const user = useSelector(selectUser)
  const [comment, setComment] = useState("")

  const newComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("RUNRUN")

    await addDoc(collection(db, "posts", props.postId, "comments"), {
      avatar: user.photoUrl,
      text: comment,
      timestamp: serverTimestamp(),
      username: user.displayName,
    })

    setComment("")
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
              <span className={styles.post_headerUser}>
                @{props.username}
              </span>
              <span className={styles.post_headerTime}>
                {new Date(props.timestamp?.toDate()).toLocaleDateString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{props.text}</p>
          </div>
        </div>
        {props.image && (
          <div className={styles.post_tweetImage}>
            <img src={props.image} alt='post' />
          </div>
        )}
        <form onSubmit={newComment}>
          <div className={styles.post_form}>
            <input
              className={styles.post_input}
              type="text"
              placeholder={"コメントを入力..."}
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
                setComment(e.target.value)
              )}
            />
            <button
              disabled={!comment}
              className={
                comment ? styles.post_button : styles.post_buttonDisable
              }
              type='submit'
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
