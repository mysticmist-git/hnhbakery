import {
  Box,
  Rating,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

function ProductRating({ rating, numReviews, size = 'small' }: any) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const sizeProps = isSmallScreen ? { size: 'small' } : { size };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating
        value={rating}
        sx={{ color: theme.palette.secondary.main }}
        precision={0.5}
        max={5}
        readOnly
        {...sizeProps}
      />
      <Typography
        variant="button"
        sx={{
          ml: 1,
          color: theme.palette.secondary.main,
        }}
      >
        {numReviews ? `(${numReviews} lượt đánh giá)` : ''}
      </Typography>
    </Box>
  );
}

export default ProductRating;
