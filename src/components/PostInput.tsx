import { Avatar } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth } from '../firebase';
import style from './PostInput.module.css';

const PostInput:React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      <Avatar
        className={style.post_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut();
        }}
      />
    </div>
  )
}

export default PostInput
