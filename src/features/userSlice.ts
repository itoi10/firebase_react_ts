import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

interface USER {
  displayName: string
  photoUrl: string
}

export const userSlice = createSlice({
  name: 'user',
  // stateの初期値
  initialState: {
    user: {
      uid: '',
      photoUrl: '',
      displayName: '',
    },
  },
  // reducerはstateを更新する関数
  reducers: {
    login: (state, action) => {
      // ログイン成功時にstateにユーザー情報を格納
      state.user = action.payload
    },
    logout: (state) => {
      // ログアウト時にstateのユーザー情報を初期化
      state.user = { uid: '', photoUrl: '', displayName: '' }
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName
      state.user.photoUrl = action.payload.photoUrl
    },
  },
})

// アプリケーションの他の部分からアクションを使用できるようにする
export const { login, logout, updateUserProfile } = userSlice.actions
// stateの値を取得するための関数
export const selectUser = (state: RootState) => state.user.user
// 作成したスライスのreducerをエクスポート
export default userSlice.reducer
