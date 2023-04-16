import { NotifierType, SignUpProps, SignUpPropsFromObject } from '@/lib/signup';
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
} from '@mui/material';
import { Box } from '@mui/material';
import { default as NextLink } from 'next/link';

export default function SignUpForm({
  handleSignUp,
  validate,
  notifier,
}: {
  handleSignUp: (props: SignUpProps) => Promise<NotifierType>;
  validate: (data: any) => boolean;
  notifier: (type: NotifierType) => void;
}) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataObject = Object.fromEntries(data.entries());

    const signUpData = SignUpPropsFromObject(dataObject);

    console.log(signUpData);
    if (!validate(signUpData)) {
      notifier(NotifierType.EMPTY_FIELD);
      return;
    }
    const result = await handleSignUp(signUpData);

    notifier(result);
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
            label="First Name"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label="I want to receive inspiration, marketing promotions and updates via email."
          />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign Up
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <NextLink href="/auth" passHref legacyBehavior>
            <Link variant="body2">Already have an account? Sign in</Link>
          </NextLink>
        </Grid>
      </Grid>
    </Box>
  );
}
