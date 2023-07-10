import { ProductDetailContext } from '@/lib/contexts/productDetail';
import { Comments } from '@/lib/types/product-detail';
import { Box, Grid, Pagination, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useContext } from 'react';
import ProductRating from '../ProductRating';

function Comments({ comments }: { comments: Comments }) {
  const theme = useTheme();
  const context = useContext(ProductDetailContext);
  const { product: productDetail } = context;
  const avatarHeight = '50px';
  return (
    <>
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        spacing={2}
      >
        <Grid item xs={12} md={8} lg={12}>
          <Typography
            variant="h2"
            align="center"
            color={theme.palette.secondary.main}
          >
            Đánh giá
          </Typography>
        </Grid>

        <Grid item xs={12} md={8} lg={12}>
          <Box
            sx={{
              bgcolor: theme.palette.primary.light,
              py: 3,
              px: 4,
              borderRadius: '8px',
            }}
          >
            <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              spacing={2}
            >
              <Grid item xs={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: { sm: 'row', xs: 'column' },
                    }}
                  >
                    <Typography
                      variant="body1"
                      color={theme.palette.secondary.main}
                    >
                      4.5
                    </Typography>
                    <Typography
                      sx={{ ml: { sm: 1, xs: 0 } }}
                      variant="body2"
                      color={theme.palette.secondary.main}
                    >
                      trên 5 sao
                    </Typography>
                  </Box>
                  <ProductRating rating={comments.ratingAverage} size="large" />
                </Box>
              </Grid>
              <Grid item xs={8}>
                {/* <CheckboxButtonGroup
                  object={starState}
                  setObject={setStarState}
                /> */}
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} lg={12}>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
            sx={{
              px: 2,
            }}
          >
            {comments.items.map((comment: any, index: number) => (
              <Grid item xs={12} key={index}>
                <Grid
                  container
                  direction={'row'}
                  justifyContent={'center'}
                  alignItems={'start'}
                  spacing={2}
                >
                  <Grid item xs={'auto'}>
                    <Box
                      sx={{
                        borderRadius: '50%',
                        position: 'relative',
                        width: avatarHeight,
                        height: avatarHeight,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: theme.palette.secondary.main,
                      }}
                    >
                      <Box
                        component={Image}
                        src={comment.user.image}
                        alt={comment.user.name}
                        fill={true}
                        loading="lazy"
                        sx={{
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={true}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'normal',
                        }}
                        color={theme.palette.common.black}
                      >
                        {comment.user.name}
                      </Typography>
                      <ProductRating rating={comment.rating} />
                      <Typography
                        variant="button"
                        color={theme.palette.text.secondary}
                        mt={1}
                      >
                        {comment.time}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                        mt={1}
                      >
                        {comment.comment}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: theme.palette.text.secondary,
                      }}
                    ></Box>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={8} lg={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Pagination
              count={5}
              shape="rounded"
              boundaryCount={2}
              siblingCount={1}
              size="large"
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Comments;
