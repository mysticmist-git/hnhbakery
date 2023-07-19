import { FeedbackObject, SuperDetail_UserObject } from '@/lib/models';
import {
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useSnackbarService } from '@/lib/contexts';
import { CustomIconButton } from '@/components/buttons';
import { ContentCopyRounded } from '@mui/icons-material';
import { Outlined_TextField } from '@/components/order/MyModal/Outlined_TextField';
import { formatDateString } from '@/lib/utils';

export function FeedBack_Content({
  textStyle,
  modalUser,
}: {
  textStyle: any;
  modalUser: SuperDetail_UserObject | null;
}) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const getValueFromFeedBack = (feedback: FeedbackObject) => {
    var result = '';
    result += 'Mã sản phẩm: ' + feedback.product_id + '\n';
    result += 'Đánh giá: ' + feedback.rating + '/5\n';
    result += 'Thời gian: ' + formatDateString(feedback.time) + '\n';
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
        {modalUser?.feedbackObjects &&
        modalUser?.feedbackObjects?.length > 0 ? (
          modalUser?.feedbackObjects.map((feedback) => (
            <Grid item xs={12} alignSelf={'stretch'}>
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
