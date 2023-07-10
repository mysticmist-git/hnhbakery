import { CustomButton } from '@/components/buttons';
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function NumberInputWithButtons({
  min,
  max,
  value: paramValue,
  onChange,
  size = 'large',
  justifyContent = 'flex-start',
}: {
  min: number;
  max: number;
  value?: number;
  size?: 'small' | 'large';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  onChange?: (value: number) => void;
}) {
  const style = {
    spacing: size === 'small' ? 0.5 : 1,
    button_py: size === 'small' ? 0.5 : 1.5,
    button_px: size === 'small' ? 0 : 3,
    input_p: size === 'small' ? 0.5 : 1.5,
  };

  const [value, setValue] = useState(min);
  const theme = useTheme();

  const handleAddClick = () => {
    if (value < max) {
      if (onChange) onChange(value + 1);
      else setValue((prev: number) => prev + 1);
    }
  };

  const handleMinusClick = () => {
    if (value > min) {
      if (onChange) onChange(value - 1);
      else setValue((prev: number) => prev - 1);
    }
  };

  const handleOnBlur = () => {
    if (value < min) {
      if (onChange) onChange(min);
      else setValue(() => min);
    } else if (value > max) {
      if (onChange) onChange(max);
      else setValue(() => max);
    }
  };

  useEffect(() => {
    if (paramValue) setValue(() => paramValue);
  }, [paramValue]);

  useEffect(() => {
    if (max < value) {
      if (onChange) onChange(max);
      else setValue(() => max);
    }
  }, [max]);

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
          value={value}
          onBlur={handleOnBlur}
          onChange={(e) => setValue(Number(e.target.value))}
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
