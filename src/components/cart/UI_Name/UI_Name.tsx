import { Typography, useTheme } from '@mui/material';

type UI_NameProps = {
  name?: string;
};

export default function UI_Name({ name = '' }: UI_NameProps) {
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="body1"
        color={{
          xs: theme.palette.secondary.main,
          md: theme.palette.common.black,
        }}
      >
        {name}
      </Typography>
    </>
  );
}
