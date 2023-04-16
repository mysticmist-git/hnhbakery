import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';

interface NavbarButtonProps extends ButtonProps {
  isActive?: boolean;
}

export default function NavbarButton(props: NavbarButtonProps) {
  const { isActive = false, children } = props;
  const theme = useTheme();

  return (
    <Button
      variant="text"
      sx={{
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: theme.typography.body1.fontSize,
        textDecoration: isActive ? 'underline' : 'none',
        '&:hover': { textDecoration: isActive ? 'underline' : 'none' },
      }}
    >
      {children}
    </Button>
  );
}
