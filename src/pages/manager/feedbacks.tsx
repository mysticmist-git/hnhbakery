import FeedbackTable from '@/components/feedbacks/FeedbackTable';
import ModalState from '@/components/feedbacks/ModalState';
import MyModal from '@/components/feedbacks/MyModal';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import {
  FeedbackObject,
  ProductObject,
  SuperDetail_FeedbackObject,
  UserObject,
} from '@/lib/models';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Feedbacks = ({ feedbackData }: { feedbackData: string }) => {
  const [feedbacks, setFeedbacks] = useState<SuperDetail_FeedbackObject[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const parsedFeedbacks =
      (JSON.parse(feedbackData) as SuperDetail_FeedbackObject[]) ?? [];
    setFeedbacks(() => parsedFeedbacks);
  }, []);

  const handleFeedbackDataChange = (value: SuperDetail_FeedbackObject) => {
    setFeedbacks(() => {
      return feedbacks.filter((feedback) => {
        return feedback.id !== value.id;
      });
    });
  };

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = useState(false);
  const [currentViewFeedback, setCurrentViewFeedback] =
    useState<SuperDetail_FeedbackObject | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewFeedbackModalChiTiet = (
    value: SuperDetail_FeedbackObject
  ) => {
    handleOpenModalChiTiet();
    setCurrentViewFeedback(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [feedbackState, setFeedbackState] =
    useState<SuperDetail_FeedbackObject | null>(null);

  const handleViewFeedbackModalState = (
    feedback: SuperDetail_FeedbackObject
  ) => {
    handleOpenModalState();
    setFeedbackState(() => feedback);
  };
  //#endregion

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Quản lý feedback
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <FeedbackTable
              feedbackData={feedbacks}
              handleViewFeedback={handleViewFeedbackModalChiTiet}
              handleViewFeedbackModalState={handleViewFeedbackModalState}
            />

            {/* Modal chi tiết */}
            <MyModal
              open={openModalChiTiet}
              handleClose={handleCloseModalChiTiet}
              feedback={currentViewFeedback}
            />

            {/* Modal state */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              feedbackState={feedbackState}
              setFeedbackState={setFeedbackState}
              handleFeedbackDataChange={handleFeedbackDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const feedbacks = await getCollection<FeedbackObject>(
      COLLECTION_NAME.FEEDBACKS
    );
    const products = await getCollection<ProductObject>(
      COLLECTION_NAME.PRODUCTS
    );
    const users = await getCollection<UserObject>(COLLECTION_NAME.USERS);

    const finalFeedbacks: SuperDetail_FeedbackObject[] = feedbacks
      .map((feedback) => {
        const user = users.find((user) => user.id === feedback.user_id);
        const product = products.find(
          (product) => product.id === feedback.product_id
        );

        return {
          ...feedback,
          userObject: user,
          productObject: product,
        };
      })
      .sort((a, b) => {
        return (
          new Date(b.time ?? '').getTime() - new Date(a.time ?? '').getTime()
        );
      });

    return {
      props: {
        feedbackData: JSON.stringify(finalFeedbacks),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        feedbackData: '',
      },
    };
  }
};

export default Feedbacks;
