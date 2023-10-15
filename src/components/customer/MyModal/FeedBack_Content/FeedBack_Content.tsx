import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
// import { FeedbackObject, SuperDetail_UserObject } from '@/lib/models';
import { formatDateString } from '@/lib/utils';
import { FeedbackTableRow } from '@/models/feedback';
import { UserTableRow } from '@/models/user';
import { ContentCopyRounded } from '@mui/icons-material';
import {
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

export default function FeedBack_Content({
  textStyle,
  modalUser,
}: {
  textStyle: any;
  modalUser: UserTableRow | null;
}) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const getValueFromFeedBack = (feedback: FeedbackTableRow) => {
    var result = '';
    result += 'Mã sản phẩm: ' + feedback.product_id + '\n';
    result += 'Đánh giá: ' + feedback.rating + '/5\n';
    // result += 'Thời gian: ' + formatDateString(feedback.time) + '\n';
    result += 'Bình luận: ' + feedback.comment;
    return result;
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        {modalUser?.feedbacks && modalUser?.feedbacks?.length > 0 ? (
          modalUser?.feedbacks.map((feedback, index) => (
            <Grid item xs={12} alignSelf={'stretch'} key={index}>
              <Outlined_TextField
                textStyle={textStyle}
                multiline
                label={'Mã feedback: ' + feedback.id ?? 'Trống'}
                value={getValueFromFeedBack(feedback)}
                InputProps={{
                  readOnly: true,
                  style: {
                    pointerEvents: 'auto',
                    borderRadius: '8px',
                  },
                  endAdornment: feedback.id && (
                    <InputAdornment position="end">
                      <CustomIconButton
                        edge="end"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            feedback.product_id ?? 'Trống'
                          );
                          handleSnackbarAlert(
                            'success',
                            'Đã sao chép mã feedback vào clipboard!'
                          );
                        }}
                      >
                        <Tooltip title="Sao chép mã feedback vào clipboard">
                          <ContentCopyRounded fontSize="small" />
                        </Tooltip>
                      </CustomIconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} alignSelf={'stretch'}>
            <Typography
              align="center"
              variant="button"
              sx={{ color: theme.palette.common.black }}
            >
              Trống
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
