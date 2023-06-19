/*
MUIのテンプレートを元に作成
https://mui.com/material-ui/getting-started/templates/
Sign-in side
*/
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../features/userSlice';
import { auth, googleProvider, storage } from '../firebase';
import styles from './Auth.module.css';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/itoi10">
        itoi10
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// ランダムな文字列を生成
const generateRandomChar = (length: number = 16): string => {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map((n) => S[n % S.length]).join('');
  return randomChar;
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Auth:React.FC = () => {
  const dispatch = useDispatch();
  // Email, Passwordによる認証
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  // Email,Passwordによるログイン
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err.message));
  }
  // Email,Passwordによる新規登録
  const signUpEmail = async () => {
    const authUser =  await auth.createUserWithEmailAndPassword(email, password).catch((err) => alert(err.message));
    let url = '';
    if (avatarImage) {
      // ファイル名が衝突しないように、ランダムな文字列を生成
      const fileName = generateRandomChar() + '_' + avatarImage.name;
      // アバター画像をstorageにアップロード
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref('avatars').child(fileName).getDownloadURL();
    }
    // ユーザー情報を更新
    await authUser?.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });
    // ユーザー情報をReduxに保存
    dispatch(updateUserProfile({
      displayName: username,
      photoUrl: url,
    }));
  }

  // アバター画像設定
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // !をつけることでnullではないことを明示的に示す
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      // onChangeが毎回呼ばれるようにするために、inputのvalueを空にする
      e.target.value = '';
    }
  }

  // Google認証
  const signInGoogle = async () => {
    // Google認証のポップアップを表示
    await auth.signInWithPopup(googleProvider).catch((err) => alert(err.message));
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1661956601030-fdfb9c7e9e2f)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
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
              {isLoginMode ? "ログイン" : "アカウント作成"}
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>

              {/* 新規登録時はユーザー名とアバター画像登録を表示 */}
              {!isLoginMode && (<>
                <TextField
                  variant='outlined'
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
              </>)}

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
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<EmailIcon />}
                onClick={
                  isLoginMode
                    ? async () => {
                        try {
                          await signInEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                }
              >
                {isLoginMode ? "Eメールでログイン" : "アカウント作成"}
              </Button>

              <Grid container>
                <Grid item xs>
                  <span className={styles.login_reset}>
                    パスワードを忘れた
                  </span>
                </Grid>
                <Grid item>
                  <span
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className={styles.login_toggleMode}
                  >
                    {isLoginMode ? "アカウントを作成する" : "ログイン画面に戻る"}
                  </span>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signInGoogle}
              >
                Sign In with Google
              </Button>

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Auth
