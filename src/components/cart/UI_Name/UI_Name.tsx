import { Typography, useTheme } from '@mui/material';

export default function UI_Name(props: any) {
  const hello = 5;
  const theme = useTheme();
  const { row } = props;

  return (
    <>
      <Typography
        variant="body1"
        color={{
          xs: theme.palette.secondary.main,
          md: theme.palette.common.black,
        }}
      >
        {row.name}
      </Typography>
    </>
  );
}
