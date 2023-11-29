import { db, storage } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { FeedbackObject, UserObject, userConverter } from '@/lib/models';
import { formatDateString } from '@/lib/utils';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { collection, doc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import FeedbackImage from '../FeedbackImage';
import ProductRating from '../ProductRating';
import { FeedbackTableRow } from '@/models/feedback';

const avatarHeight = '50px';

const FeedbackItem = ({
  key,
  feedback,
}: {
  key: React.Key;
  feedback: FeedbackTableRow;
}) => {
  const theme = useTheme();

  const [image, iLoading, iError] = useDownloadURL(
    feedback.user && feedback.user.avatar !== ''
      ? ref(storage, feedback.user.avatar)
      : undefined
  );

  return (
    <Grid item xs={12} key={key}>
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'start'}
        spacing={2}
      >
        <Grid item xs={'auto'}>
          <Box
            component={'div'}
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
            <FeedbackImage image={image ?? ''} alt={'Avatar comment'} />
          </Box>
        </Grid>
        <Grid item xs={true}>
          <Box
            component={'div'}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'normal',
              }}
              color={theme.palette.common.black}
            >
              {feedback.user?.name}
            </Typography>
            <ProductRating rating={feedback.rating} noNumReviews />
            <Typography
              variant="button"
              color={theme.palette.text.secondary}
              mt={1}
            >
              {formatDateString(feedback.created_at)}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.common.black}
              mt={1}
            >
              {feedback.comment}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            component={'div'}
            sx={{
              borderBottom: 0.5,
              pt: 1.5,
              borderColor: 'grey.400',
            }}
          ></Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FeedbackItem;
