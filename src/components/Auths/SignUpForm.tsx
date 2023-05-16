import { auth, provider } from '@/firebase/config';
import { NotifierType, SignUpProps, SignUpPropsFromObject } from '@/lib/signup';
import { handleLoginWithGoogle } from '@/lib/localLib/auth';
import { Google } from '@mui/icons-material';
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Divider,
} from '@mui/material';
import { Box } from '@mui/material';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { default as NextLink } from 'next/link';
import router from 'next/router';
import { useSnackbarService } from '@/pages/_app';

export default function SignUpForm({
  handleSignUp,
  validate,
}: {
  handleSignUp: (props: SignUpProps) => Promise<NotifierType>;
  validate: (data: any) => boolean;
}) {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataObject = Object.fromEntries(data.entries());

    const signUpData = SignUpPropsFromObject(dataObject);

    console.log(signUpData);
    if (!validate(signUpData)) {
      handleSnackbarAlert('error', 'Vui lòng điền đủ thông tin');
      return;
    }
    await handleSignUp(signUpData);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="Tên"
            autoFocus
            color="secondary"
            sx={{
              color: (theme) => theme.palette.common.black,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="Họ"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Địa chỉ Email"
            name="email"
            autoComplete="email"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="new-password"
            color="secondary"
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          backgroundColor: 'secondary.main',
          '&:hover': {
            backgroundColor: 'secondary.dark',
          },
        }}
      >
        Đăng ký
      </Button>
      <Grid
        item
        xs={12}
        sx={{
          mb: '1rem',
        }}
      >
        <Divider />
        <Button
          fullWidth
          startIcon={<Google />}
          variant="outlined"
          color="secondary"
          sx={{
            mt: '1rem',
          }}
          onClick={handleLoginWithGoogle}
        >
          Đăng ký với Google
        </Button>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <NextLink href="/auth" passHref legacyBehavior>
            <Link variant="body2">Đã có tài khoản? Đăng nhập ngay!</Link>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
}
