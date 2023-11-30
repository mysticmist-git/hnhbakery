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
import { useEffect, useMemo, useState } from 'react';
import FeedbackDialog from '../FeedbackDialog';
import FeedbackItem from '../FeedbackItem';
import ProductRating from '../ProductRating';
import Feedback, { FeedbackTableRow } from '@/models/feedback';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { createFeedback } from '@/lib/DAO/feedbackDAO';
import { ProductDetail } from '@/models/product';
import User from '@/models/user';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';

function Feedbacks({
  productDetail,
  userId,
  productId,
  feedbacks,
}: {
  productDetail: ProductDetail | undefined;
  userId: string;
  productId: string;
  feedbacks: FeedbackTableRow[];
}) {
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);

  const rating = useMemo(() => {
    if (!feedbacks || feedbacks.length <= 0) return 0;

    return (
      feedbacks.reduce((total, comment) => total + comment.rating, 0) /
      feedbacks.length
    );
  }, [feedbacks]);

  const handleNewComment = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    try {
      const userUpload = await getUserByUid(userId);

      if (!userUpload || !productDetail) {
        return;
      }
      const newFeedback: Feedback = {
        id: '',
        rating,
        comment,
        product_id: productId,
        user_id: userUpload.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      await createFeedback(
        productDetail.product_type_id,
        productDetail.id,
        newFeedback
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDialogOpen(false);
    }
  };

  const [userData, setUserData] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function get() {
      try {
        if (userId != '') {
          const data = await getUserByUid(userId);
          if (data && data.group_id == DEFAULT_GROUP_ID) {
            setUserData(data);
          } else {
            setUserData(undefined);
          }
        }
      } catch (error: any) {
        console.log(error);
        setUserData(undefined);
      }
    }

    get();
  }, [userId]);

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
            component={'div'}
            sx={{
              backgroundColor: 'white',
              border: 3,
              borderColor: theme.palette.secondary.main,
              py: 4,
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
                  component={'div'}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    component={'div'}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      component={'div'}
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
                      numReviews={feedbacks ? feedbacks.length : 0}
                    />
                  </Box>
                  {userData && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Add />}
                      onClick={handleNewComment}
                    >
                      Thêm đánh giá
                    </Button>
                  )}
                </Box>
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
              pt: 2,
            }}
          >
            {feedbacks.map((feedback, index) => (
              <FeedbackItem key={index} feedback={feedback} />
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={8} lg={12} sx={{ display: 'none' }}>
          <Box
            component={'div'}
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
