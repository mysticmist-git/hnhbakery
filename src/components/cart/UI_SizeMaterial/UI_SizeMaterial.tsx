import { Typography, useTheme } from '@mui/material';

export default function UI_SizeMaterial({
  size = 'default size',
  material = 'default material',
}: {
  size?: string;
  material?: string;
}) {
  const theme = useTheme();

  return (
    <>
      <Typography variant={'button'} color={theme.palette.text.secondary}>
        {'Size ' + size + ' + ' + material}
      </Typography>
    </>
  );
}
