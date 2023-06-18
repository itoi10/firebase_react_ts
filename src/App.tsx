import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styles from './App.module.css';
import Auth from './components/Auth';
import { Feed } from './components/Feed';
import { login, logout, selectUser } from "./features/userSlice";
import { auth } from "./firebase";


const  App:React.FC = () => {
  // userのstate取得
  const user = useSelector(selectUser);
  // アクションをdispatchするための関数を取得
  const dispatch = useDispatch();

  useEffect(() => {
      // onAuthStateChangedはログイン状態が変わると呼ばれる
      const unsubscribe = auth.onAuthStateChanged((userAuth) => {
        if(userAuth) {
          // ログインしたので、userのstateを更新
          dispatch(login({
            uid: userAuth.uid,
            photoUrl: userAuth.photoURL,
            displayName: userAuth.displayName,
          }))
        } else {
          // ログアウト
          dispatch(logout());
        }
      })

      // コンポーネントがアンマウントされるときに実行される
      return () => {
        // onAuthStateChangedの監視を解除
        unsubscribe();
      }
  }, [dispatch])

  return (
    <>
      {user.uid ? (
        // ログインしているので、Feedコンポーネントを表示
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        // ログインしていないので、Authコンポーネントを表示
        <Auth />
      )}
    </>
  )
}

export default App;
