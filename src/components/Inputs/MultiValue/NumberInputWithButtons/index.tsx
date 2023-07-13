import { CustomButton } from '@/components/buttons';
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

// Button component to avoid code duplication
function Button({ onClick, children, style }: any) {
  return (
    <Grid
      item
      sx={{
        display: {
          xs: 'none',
          sm: 'block',
        },
      }}
    >
      <CustomButton onClick={onClick} sx={style}>
        <Typography variant="body1" color="white">
          {children}
        </Typography>
      </CustomButton>
    </Grid>
  );
}

export default function NumberInputWithButtons({
  min = 1,
  max = 1,
  value: paramValue,
  onChange,
  size = 'large',
  justifyContent = 'flex-start',
}: {
  min: number;
  max: number;
  value?: number;
  onChange?: (value: number) => void;
  size?: 'small' | 'large';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
}) {
  const style = useMemo(
    () => ({
      spacing: size === 'small' ? 0.5 : 1,
      button_py: size === 'small' ? 0.5 : 1.5,
      button_px: size === 'small' ? 0 : 3,
      input_p: size === 'small' ? 0.5 : 1.5,
    }),
    [size]
  );

  const [value, setValue] = useState(min);
  const theme = useTheme();

  function handleAddClick() {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  }

  function handleMinusClick() {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  }

  function handleOnBlur() {
    if (value < min) {
      setValue(min);
      if (onChange) {
        onChange(min);
      }
    } else if (value > max) {
      setValue(max);
      if (onChange) {
        onChange(max);
      }
    }
  }

  useEffect(() => {
    if (max < value) {
      setValue(() => max);

      if (onChange) {
        onChange(max);
      }
    }
  }, [max]);

  useEffect(() => {
    if (paramValue !== undefined) setValue(paramValue);
  }, [paramValue]);

  const buttonStyle = {
    py: style.button_py,
    px: style.button_px,
    borderRadius: '8px',
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent={justifyContent}
      spacing={style.spacing}
      alignItems={'center'}
      width={'auto'}
    >
      <Button onClick={handleMinusClick} style={buttonStyle}>
        -
      </Button>
      <Grid item>
        <TextField
          value={value}
          onBlur={handleOnBlur}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (
              Number.isInteger(newValue) &&
              newValue >= min &&
              newValue <= max
            ) {
              setValue(newValue);
            }
          }}
          type="number"
          variant="filled"
          hiddenLabel
          maxRows="1"
          sx={{
            '&:hover': {
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3
              )}`,
            },
            '& .MuiInputBase-root': {
              p: 0,
            },
            '& .MuiInputAdornment-root': {
              m: 0,
            },
          }}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  backgroundColor: theme.palette.common.white,
                  maxHeight: 'none',
                  height: 'auto',
                  alignSelf: 'stretch',
                  pr: 2,
                }}
              >
                <Typography
                  variant="body1"
                  color={theme.palette.secondary.main}
                >
                  {'/' + max.toString()}
                </Typography>
              </InputAdornment>
            ),
          }}
          style={{
            border: `3px solid ${theme.palette.secondary.main}`,
            borderRadius: '8px',
            borderColor: theme.palette.secondary.main,
            borderStyle: 'solid',
            overflow: 'hidden',
          }}
          inputProps={{
            sx: {
              textAlign: 'center',
              fontSize: theme.typography.body1.fontSize,
              color: theme.palette.common.black,
              fontWeight: theme.typography.body1.fontWeight,
              fontFamily: theme.typography.body1.fontFamily,
              p: style.input_p,
              backgroundColor: theme.palette.common.white,
            },
            min: min,
            max: max,
          }}
        />
      </Grid>
      <Button onClick={handleAddClick} style={buttonStyle}>
        +
      </Button>
    </Grid>
  );
}
