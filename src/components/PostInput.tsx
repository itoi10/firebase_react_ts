import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import { Avatar, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import firebase from 'firebase';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth, db, storage } from '../firebase';
import { generateRandomChar } from '../utils/functions';
import style from './PostInput.module.css';

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


      await db.collection('posts').add({
        avatar: user.photoUrl,
        image: imageUrl,
        text: postMessage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Time the server receives the update
        username: user.displayName,
      })

    console.log("Finish addToDB")
    }

    if (postImage) {
      const filename = generateRandomChar() + "_" + postImage.name;
      const uploadPostImage = storage.ref(`images/${filename}`).put(postImage);

      // Register three observers
      // https://firebase.google.com/docs/storage/web/upload-files?hl=ja
      uploadPostImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // progress
        () => {},
        // error
        (err) => { alert(err.message) },
        // complete
        async () => {
          await storage.ref("images").child(filename).getDownloadURL()
          .then(async (url) => {
            await addToDB(url);
          })
          }
      )

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
