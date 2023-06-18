import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
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
    <div className="App">
      {/* テスト */}
      {user !== null && user !== undefined ? (
        <>
        <p>ログインしました</p>
        <p>{user.uid}</p>
        <p>{user.displayName}</p>
        <p>{user.photoUrl}</p>
        </>
      ) : (
        <p>ログアウトしました</p>
      )}
    </div>
  );
}

export default App;
