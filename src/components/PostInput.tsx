import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import { Avatar, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth, db, storage } from '../firebase';
import { generateRandomChar } from '../utils/functions';
import style from './PostInput.module.css';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const PostInput:React.FC = () => {
  const user = useSelector(selectUser);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postMessage, setPostMessage] = useState('');

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setPostImage(e.target.files![0]);
      e.target.value = '';
    }
  }

  const sendPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const addToDB = async (imageUrl:string) => {
      console.log("Run addToDB")


      await addDoc(collection(db, "posts"), {
        avatar: user.photoUrl,
        image: imageUrl,
        text: postMessage,
        timestamp: serverTimestamp(),
        username: user.displayName,
      })

    console.log("Finish addToDB")
    }

    if (postImage) {
      const filename = generateRandomChar() + "_" + postImage.name;
      const storageRef = ref(storage, `images/${filename}`)

      uploadBytes(storageRef, postImage).then(async (snapshot) => {
        console.log('Uploaded a blob or file!');

        const storageRef = ref(storage, "images/" + filename)

        getDownloadURL(storageRef).then(async (url) => {
            await addToDB(url);
          });
        }).catch((error) => {
          console.log(error);
          alert(error.message);
        });

    } else {
      addToDB('');
    }

    // empty the input
    setPostMessage('');
    setPostImage(null);
  }

  return (
    <>
      <form onSubmit={sendPost}>
        <div className={style.post_form}>
          <Avatar
            className={style.post_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          {/* Text input */}
          <input
            className={style.post_input}
            type="text"
            placeholder="Start a post"
            value={postMessage}
            onChange={(e) => setPostMessage(e.target.value)}
          />
          {/* Image input */}
          <IconButton>
            <label>
              <AddPhotoIcon
                className={postImage ? style.post_addIconLoaded : style.post_addIcon}
              />
              <input
                className={style.post_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        {/* Post button */}
        <Button
          type="submit"
          disabled={!postMessage}
          className={postMessage ? style.post_sendBtn : style.post_sendDisableBtn}
        >
          Post
        </Button>
      </form>
    </>
  )
}

export default PostInput
