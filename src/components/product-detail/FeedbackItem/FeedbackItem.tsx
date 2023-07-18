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

const avatarHeight = '50px';

const FeedbackItem = ({
  key,
  value,
}: {
  key: React.Key;
  value: FeedbackObject;
}) => {
  const theme = useTheme();

  const [user, uLoading, uError] = useDocumentData<UserObject>(
    doc(collection(db, COLLECTION_NAME.USERS), value.user_id).withConverter(
      userConverter
    )
  );

  const [image, iLoading, iError] = useDownloadURL(
    user && user?.image !== '' ? ref(storage, user.image) : undefined
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
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'normal',
              }}
              color={theme.palette.common.black}
            >
              {user?.name}
            </Typography>
            <ProductRating rating={value.rating} noNumReviews />
            <Typography
              variant="button"
              color={theme.palette.text.secondary}
              mt={1}
            >
              {formatDateString(value.time)}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.common.black}
              mt={1}
            >
              {value.comment}
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
  );
};

export default FeedbackItem;
