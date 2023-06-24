import { Avatar } from '@mui/material';
import React from 'react';
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
      </div>
    </div>
  )
}


export default Post
