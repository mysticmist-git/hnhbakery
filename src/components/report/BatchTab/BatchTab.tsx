import { ChevronLeft } from '@mui/icons-material';
import { Divider, Grid, IconButton, Typography } from '@mui/material';

type BatchTabProps = {
  onClickBack(): void;
};

export default function BatchTab({ onClickBack }: BatchTabProps) {
  return (
    <>
      <Grid item xs={12} display={'flex'} alignItems={'center'} gap={1}>
        <IconButton
          sx={{
            borderRadius: 2,
            color: 'white',
            backgroundColor: 'secondary.main',
            ':hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          onClick={onClickBack}
        >
          <ChevronLeft />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Typography
          typography="h6"
          sx={{
            cursor: 'default',
            transition: '0.2s ease-in-out',
            ':hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
              translate: '10%',
            },
          }}
        >
          Lô hàng
        </Typography>
      </Grid>
    </>
  );
}
