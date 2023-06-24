import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import styles from './Feed.module.css';
import PostInput from './PostInput';

const Feed:React.FC = () => {

  const [posts, setPosts] = useState([
    {
      id: "",
      avatar:"",
      image:"",
      text:"",
      timestamp:null,
      username:"",
    }
  ]);

    // Fetch Posts
    useEffect(() => {
      const q = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        )
      });

      console.log(posts)

      return () => {
        unsubscribe();
      };
    }, []);

  return (
    <div className={styles.feed}>

      <PostInput />
      {posts.map(post => (
        <h3>{post.id}</h3>
      ))}

    </div>
  )
}

export default Feed;


