import { COLLECTION_NAME } from '@/lib/constants';
import { addDocToFirestore } from '@/lib/firestore';
import { FeedbackObject } from '@/lib/models';
import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  Pagination,
  Typography,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import FeedbackDialog from '../FeedbackDialog';
import FeedbackItem from '../FeedbackItem';
import ProductRating from '../ProductRating';

function Feedbacks({
  userId,
  productId,
  comments,
}: {
  userId: string;
  productId: string;
  comments: FeedbackObject[];
}) {
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);

  const rating = useMemo(() => {
    if (!comments || comments.length <= 0) return 0;

    return (
      comments.reduce((total, comment) => total + comment.rating, 0) /
      comments.length
    );
  }, [comments]);

  const handleNewComment = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    try {
      const newFeedback: FeedbackObject = {
        rating,
        comment,
        time: new Date(),
        product_id: productId,
        user_id: userId,
      };

      await addDocToFirestore(newFeedback, COLLECTION_NAME.FEEDBACKS);
    } catch (error) {
      console.log(error);
    } finally {
      setDialogOpen(false);
    }
  };

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
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
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
                        {rating}
                      </Typography>
                      <Typography
                        sx={{ ml: { sm: 1, xs: 0 } }}
                        variant="body2"
                        color={theme.palette.secondary.main}
                      >
                        trên 5 sao
                      </Typography>
                    </Box>
                    <ProductRating
                      rating={rating}
                      size="large"
                      numReviews={comments ? comments.length : 0}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Add />}
                    onClick={handleNewComment}
                  >
                    Thêm đánh giá
                  </Button>
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
            {comments.map((comment, index) => (
              <FeedbackItem key={index} value={comment} />
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={8} lg={12} sx={{ display: 'none' }}>
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

      <FeedbackDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        handleSubmit={handleSubmitFeedback}
      />
    </>
  );
}

export default Feedbacks;
