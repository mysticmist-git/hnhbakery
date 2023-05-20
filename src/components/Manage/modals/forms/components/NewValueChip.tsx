import { Add } from '@mui/icons-material';
import { Divider, ButtonBase, Input } from '@mui/material';
import { Box } from '@mui/system';
import { memo } from 'react';

const NewValueChip = ({
  value,
  placeholder,
  width,
  onChange,
  onClick,
}: {
  value?: string;
  placeholder?: string;
  width?: string;
  onChange?: any;
  onClick?: any;
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#eee',
        borderRadius: '1rem',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '12px',
      }}
    >
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        sx={{
          border: 'none',
          backgroundColor: 'transparent',
          width: width ?? '52px',
          color: 'common.black',
          typography: (theme) => theme.typography.body2,
        }}
        disableUnderline
      />
      <Divider sx={{ height: 28, my: 0.5, ml: 0.5 }} orientation="vertical" />
      <ButtonBase
        onClick={onClick}
        sx={{
          border: 'none',
          backgroundColor: '#ccc',
          color: 'common.white',
          paddingX: '4px',
          borderRadius: '0 1rem 1rem 0',
          marginY: '0',
          height: '100%',
          '&:hover': {
            backgroundColor: '#bbb',
          },
        }}
      >
        <Add />
      </ButtonBase>
    </Box>
  );
};

export default memo(NewValueChip);
