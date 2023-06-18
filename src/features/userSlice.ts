import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';


export const userSlice = createSlice({
  name: 'user',
  // stateの初期値
  initialState: {
    user: {
      uid: '',
      photoUrl: '',
      displayName: '',
    }
  },
  // reducerはstateを更新する関数
  reducers: {
    login: (state, action) => {
      // ログイン成功時にstateにユーザー情報を格納
      state.user = action.payload;
    },
    logout: (state) => {
      // ログアウト時にstateのユーザー情報を初期化
      state.user = {uid: '', photoUrl: '', displayName: ''};
    },
  },
});

// アプリケーションの他の部分からアクションを使用できるようにする
export const { login, logout } = userSlice.actions;
// stateの値を取得するための関数
export const selectUser = (state: RootState) => state.user.user;
// 作成したスライスのreducerをエクスポート
export default userSlice.reducer;
