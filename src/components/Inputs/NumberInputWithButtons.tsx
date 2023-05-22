import {
  Grid,
  Typography,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomButton } from '@/components/Inputs/Buttons';

export function NumberInputWithButtons({
  min,
  max,
  value = 0,
  size = 'large',
  justifyContent = 'flex-start',
  onChange,
}: any) {
  const style = {
    spacing: size === 'small' ? 0.5 : 1,
    button_py: size === 'small' ? 0.5 : 1.5,
    button_px: size === 'small' ? 0 : 3,
    input_p: size === 'small' ? 0.5 : 1.5,
  };
  const [inputValue, setInputValue] = useState(value);
  const theme = useTheme();

  const handleAddClick = () => {
    if (inputValue < max) {
      setInputValue((prevValue: number) => prevValue + 1);
    }
  };

  const handleMinusClick = () => {
    if (inputValue > min) {
      setInputValue((prevValue: number) => prevValue - 1);
    }
  };

  const handleOnBlur = () => {
    if (inputValue < min) {
      setInputValue(min);
    } else if (inputValue > max) {
      setInputValue(max);
    }
  };

  useEffect(() => {
    if (onChange) onChange(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setInputValue((prev: number) => value);
  }, [value]);

  useEffect(() => {
    setInputValue((prev: number) => min);
  }, [min, max]);

  return (
    <Grid
      container
      direction="row"
      justifyContent={justifyContent}
      spacing={style.spacing}
      alignItems={'center'}
      width={'auto'}
    >
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        <CustomButton
          onClick={handleMinusClick}
          sx={{
            py: style.button_py,
            px: style.button_px,
            borderRadius: '8px',
          }}
        >
          <Typography variant="body1" color={theme.palette.common.white}>
            -
          </Typography>
        </CustomButton>
      </Grid>
      <Grid item>
        <TextField
          value={inputValue}
          onBlur={handleOnBlur}
          onChange={(e) => setInputValue(Number(e.target.value))}
          type="number"
          variant="filled"
          hiddenLabel
          maxRows="1"
          sx={{
            '&:hover': {
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3,
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
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        <CustomButton
          onClick={handleAddClick}
          sx={{
            py: style.button_py,
            px: style.button_px,
            borderRadius: '8px',
          }}
        >
          <Typography variant="body1" color={theme.palette.common.white}>
            +
          </Typography>
        </CustomButton>
      </Grid>
    </Grid>
  );
}
