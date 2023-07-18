import { useSnackbarService } from '@/lib/contexts';
import { Contact } from '@/lib/models';
import { Grid, InputAdornment, Tooltip } from '@mui/material';
import { Outlined_TextField } from '../order/MyModal/Outlined_TextField';
import { CustomIconButton } from '../buttons';
import { ContentCopyRounded } from '@mui/icons-material';

export function ThongTin_Content({
  textStyle,
  modalContact,
}: {
  textStyle: any;
  modalContact: Contact | null;
}) {
  const handleSnackbarAlert = useSnackbarService();

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Email"
            value={modalContact?.email ?? 'Trống'}
            InputProps={{
              readOnly: true,
              style: {
                pointerEvents: 'auto',
                borderRadius: '8px',
              },
              endAdornment: modalContact?.email && (
                <InputAdornment position="end">
                  <CustomIconButton
                    edge="end"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        modalContact?.email ?? 'Trống'
                      );
                      handleSnackbarAlert(
                        'success',
                        'Đã sao chép email vào clipboard!'
                      );
                    }}
                  >
                    <Tooltip title="Sao chép email vào clipboard">
                      <ContentCopyRounded fontSize="small" />
                    </Tooltip>
                  </CustomIconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Tiêu đề"
            value={modalContact?.title ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Tên khách"
            value={modalContact?.name ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            label="Số điện thoại"
            value={modalContact?.phone ?? 'Trống'}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            multiline
            rows={3}
            label="Nội dung"
            value={modalContact?.content ?? 'Trống'}
          />
        </Grid>
      </Grid>
    </>
  );
}
