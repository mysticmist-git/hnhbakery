import { Typography, useTheme } from '@mui/material';

export default function UI_SizeMaterial(props: any) {
  const theme = useTheme();
  const { row } = props;
  return (
    <>
      <Typography variant={'button'} color={theme.palette.text.secondary}>
        {'Size ' + row.size + ' + ' + row.material}
      </Typography>
    </>
  );
}
