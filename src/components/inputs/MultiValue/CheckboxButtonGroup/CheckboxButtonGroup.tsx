import { Button, Grid, useTheme } from '@mui/material';

function CheckboxButtonGroup<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  valueEqualOption,
}: {
  options: T[];
  value: T | undefined;
  onChange: (newValue: T) => void;
  getOptionLabel: (option: T) => string;
  valueEqualOption: (value: T | undefined, option: T) => boolean;
}) {
  const handleClick = (option: T) => {
    onChange(option);
  };

  const theme = useTheme();

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {options.map((option, i) => (
        <Grid key={i} item>
          <Button
            key={i}
            variant="contained"
            onClick={() => handleClick(option)}
            sx={{
              bgcolor: valueEqualOption(value, option)
                ? theme.palette.secondary.main
                : 'transparent',
              color: valueEqualOption(value, option)
                ? theme.palette.common.white
                : theme.palette.secondary.main,
              transition: 'opacity 0.2s',
              py: { md: 0.5, xs: 0.5 },
              px: { md: 1.5, xs: 1 },
              border: 0,
              borderColor: theme.palette.secondary.main,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.common.white,
              },
            }}
          >
            {getOptionLabel(option)}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default CheckboxButtonGroup;
