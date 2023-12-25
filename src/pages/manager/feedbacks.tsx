import FeedbackTable from '@/components/feedbacks/FeedbackTable';
import ModalState from '@/components/feedbacks/ModalState';
import MyModal from '@/components/feedbacks/MyModal';
import { getFeedbacks } from '@/lib/DAO/feedbackDAO';
import { DEFAULT_GROUP_ID } from '@/lib/DAO/groupDAO';
import { getProducts } from '@/lib/DAO/productDAO';
import { getProductTypes } from '@/lib/DAO/productTypeDAO';
import { getUser } from '@/lib/DAO/userDAO';
import useLoadingService from '@/lib/hooks/useLoadingService';

import { FeedbackTableRow } from '@/models/feedback';

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

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackTableRow[]>([]);
  const theme = useTheme();
  const [load, stop] = useLoadingService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        const finalFeedbacks: FeedbackTableRow[] = [];
        const productTypes = await getProductTypes();

        for (let p of productTypes) {
          const products = await getProducts(p.id);
          for (let product of products) {
            const feedbacks = await getFeedbacks(p.id, product.id);
            for (let feedback of feedbacks) {
              finalFeedbacks.push({
                ...feedback,
                product: product,
                user: await getUser(DEFAULT_GROUP_ID, feedback.user_id),
              });
            }
          }
        }

        setFeedbacks(
          () =>
            finalFeedbacks.sort((a, b) =>
              a.created_at > b.created_at ? -1 : 1
            ) || []
        );
        stop();
      } catch (error) {
        console.log(error);
        stop();
      }
    };

    fetchData();
  }, []);

  const handleFeedbackDataChange = (value: FeedbackTableRow) => {
    setFeedbacks(() => {
      return feedbacks.filter((feedback) => {
        return !(
          feedback.id == value.id &&
          feedback.product_id == value.product_id &&
          feedback.product?.product_type_id == value.product?.product_type_id
        );
      });
    });
  };

  //#region Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = useState(false);
  const [currentViewFeedback, setCurrentViewFeedback] =
    useState<FeedbackTableRow | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewFeedbackModalChiTiet = (value: FeedbackTableRow) => {
    handleOpenModalChiTiet();
    setCurrentViewFeedback(() => value);
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [feedbackState, setFeedbackState] = useState<FeedbackTableRow | null>(
    null
  );

  const handleViewFeedbackModalState = (feedback: FeedbackTableRow) => {
    handleOpenModalState();
    setFeedbackState(() => feedback);
  };
  //#endregion

  return (
    <>
      <Box
        component={'div'}
        width={'100%'}
        sx={{ p: 2, pr: 3, overflow: 'hidden' }}
      >
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

export default Feedbacks;
