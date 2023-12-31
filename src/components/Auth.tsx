/*
MUIのテンプレートを元に作成
https://mui.com/material-ui/getting-started/templates/
Sign-in side
*/
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserProfile } from '../features/userSlice'
import { auth, googleProvider, storage } from '../firebase'
import styles from './Auth.module.css'

import GoogleIcon from '@mui/icons-material/Google'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SendIcon from '@mui/icons-material/Send'
import IconButton from '@mui/material/IconButton'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { generateRandomChar } from '../utils/functions'

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/itoi10">
        itoi10
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

const Auth: React.FC = () => {
  const dispatch = useDispatch()
  // Email, Passwordによる認証
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatarImage, setAvatarImage] = useState<File | null>(null)
  const [isLoginMode, setIsLoginMode] = useState(true)
  // モーダルの表示状態
  const [openModal, setOpenModal] = useState(false)
  // パスワードリセット用のメールアドレス
  const [emailForReset, setEmailForReset] = useState('')

  // パスワートリセット用のメールを送信
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await sendPasswordResetEmail(auth, emailForReset)
      .then(() => {
        setEmailForReset('')
        setOpenModal(false)
        alert('パスワードリセット用のメールを送信しました。')
      })
      .catch((err) => {
        setEmailForReset('')
        alert(err.message)
      })
  }

  // Email,Passwordによるログイン
  const signInEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password).catch((err) =>
      alert(err.message)
    )
  }
  // Email,Passwordによる新規登録
  const signUpEmail = async () => {
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((err) => alert(err.message))
    let url = ''
    if (avatarImage) {
      // ファイル名が衝突しないように、ランダムな文字列を生成
      const fileName = generateRandomChar() + '_' + avatarImage.name
      // アバター画像をstorageにアップロード
      await uploadBytes(ref(storage, `avatars/${fileName}`), avatarImage)
      url = await getDownloadURL(ref(storage, `avatars/${fileName}`))
    }
    // ユーザー情報を更新
    if (authUser && authUser.user) {
      await updateProfile(authUser.user, {
        displayName: username,
        photoURL: url,
      })
    }
    // ユーザー情報をReduxに保存
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    )
  }

  // アバター画像設定
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // !をつけることでnullではないことを明示的に示す
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0])
      // onChangeが毎回呼ばれるようにするために、inputのvalueを空にする
      e.target.value = ''
    }
  }

  // Google認証
  const signInGoogle = async () => {
    // Google認証のポップアップを表示
    await signInWithPopup(auth, googleProvider).catch((err) =>
      alert(err.message)
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1661956601030-fdfb9c7e9e2f)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLoginMode ? 'ログイン' : 'アカウント作成'}
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {/* 新規登録時はユーザー名とアバター画像登録を表示 */}
              {!isLoginMode && (
                <>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="ユーザー名"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value)
                    }}
                  />
                  <Box textAlign="center">
                    <IconButton>
                      <label>
                        {/* 画像が選択済みの場合はスタイルを変える */}
                        <AccountCircleIcon
                          fontSize="large"
                          className={
                            avatarImage
                              ? styles.login_addIconLoaded
                              : styles.login_addIcon
                          }
                        />
                        {/* ファイルダイアログ */}
                        <input
                          className={styles.login_hiddenIcon}
                          type="file"
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value)
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value)
                }}
              />

              <Button
                disabled={
                  isLoginMode
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6 || !avatarImage
                }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<EmailIcon />}
                onClick={
                  isLoginMode
                    ? async () => {
                        try {
                          await signInEmail()
                        } catch (err: any) {
                          alert(err.message)
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail()
                        } catch (err: any) {
                          alert(err.message)
                        }
                      }
                }
              >
                {isLoginMode ? 'Eメールでログイン' : 'アカウント作成'}
              </Button>

              <Grid container>
                <Grid item xs>
                  <span
                    className={styles.login_reset}
                    onClick={() => setOpenModal(true)}
                  >
                    パスワードを忘れた
                  </span>
                </Grid>
                <Grid item>
                  <span
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className={styles.login_toggleMode}
                  >
                    {isLoginMode
                      ? 'アカウントを作成する'
                      : 'ログイン画面に戻る'}
                  </span>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signInGoogle}
                startIcon={<GoogleIcon />}
              >
                Googleアカウントでログイン
              </Button>

              <Copyright sx={{ mt: 5 }} />
            </Box>

            {/* パスワードリセット用のモーダル */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box
                sx={{
                  position: 'absolute' as 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  outline: 'none',
                  width: 400,
                  borderRadius: 4,
                  backgroundColor: 'white',
                  boxShadow: '0 5 10 rgba(0, 0, 0, 0.3)',
                  padding: 10,
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="リセット用メールアドレス"
                  value={emailForReset}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmailForReset(e.target.value)
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Auth
