import { CustomButton } from '@/components/buttons';
import useNumberCounter from '@/lib/hooks/useNumberCounter';
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';

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
      button_py: size === 'small' ? 0.5 : 0.5,
      button_px: size === 'small' ? 0 : 1.5,
      input_p: size === 'small' ? 0.5 : 0.5,
    }),
    [size]
  );

  const buttonStyle = {
    py: style.button_py,
    px: style.button_px,
    borderRadius: '8px',
  };

  const theme = useTheme();
  const [value, setValue, increaseValue, decreaseValue] = useNumberCounter(
    paramValue ?? 0,
    min,
    max
  );

  useEffect(() => {
    if (onChange) onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleOnBlur() {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent={justifyContent}
      spacing={style.spacing}
      alignItems={'center'}
      width={'auto'}
    >
      <Button onClick={decreaseValue} style={buttonStyle}>
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
      <Button onClick={increaseValue} style={buttonStyle}>
        +
      </Button>
    </Grid>
  );
}
