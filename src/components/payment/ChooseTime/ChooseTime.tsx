import CustomButton from '@/components/buttons/CustomButton';
import CustomTextField from '@/components/inputs/textFields/CustomTextField';
import { MocGioGiaoHang } from '@/lib/constants';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

const ChooseTime = (props: any) => {
  const theme = useTheme();

  const { thoiGianGiao, handleSetThoiGianGiao } = props;

  // const [thoiGianGiao, setSelectedOption] = useState(options[0].value);
  const [open, setOpen] = useState(false);
  let realTime = '';
  const [customTime, setCustomTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  const handleSetSelectedOption = (event: any) => {
    if (event.target.value != MocGioGiaoHang[MocGioGiaoHang.length - 1].value) {
      // setSelectedOption(event.target.value);
      handleSetThoiGianGiao(event.target.value);
    }
  };

  const handleSetCustomTime = (e: any) => {
    setCustomTime(e.target.value);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = (reason?: string) => {
    if (reason == 'Hủy') {
      setOpen(false);
    } else if (reason == 'Xác nhận') {
      setOpen(false);
      realTime = customTime;
      MocGioGiaoHang[MocGioGiaoHang.length - 1].value = realTime;
      MocGioGiaoHang[MocGioGiaoHang.length - 1].label = realTime;
      MocGioGiaoHang[MocGioGiaoHang.length - 1].description =
        'Thời gian cụ thể';
      // setSelectedOption(options[options.length - 1].value);
      handleSetThoiGianGiao(MocGioGiaoHang[MocGioGiaoHang.length - 1].value);
    }
  };

  return (
    <>
      <TextField
        {...props}
        value={thoiGianGiao}
        onChange={handleSetSelectedOption}
        hiddenLabel
        variant="filled"
        maxRows="1"
        InputProps={{
          disableUnderline: true,
        }}
        inputProps={{
          sx: {
            fontSize: theme.typography.body2.fontSize,
            color: theme.palette.common.black,
            fontWeight: theme.typography.body2.fontWeight,
            fontFamily: theme.typography.body2.fontFamily,
            backgroundColor: theme.palette.common.white,
            border: 3,
            borderColor: props.borderColor
              ? props.borderColor
              : theme.palette.secondary.main,
            py: props.py ? props.py : 1.5,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: theme.palette.common.white,
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3
              )}`,
            },
            '&:focus': {
              backgroundColor: theme.palette.common.white,
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3
              )}`,
            },
          },
        }}
      >
        {MocGioGiaoHang.map((option: any) => (
          <MenuItem
            key={option.value}
            value={option.value}
            onClick={
              option.value == MocGioGiaoHang[MocGioGiaoHang.length - 1].value
                ? handleDialogOpen
                : () => {}
            }
          >
            <Box>
              <Typography variant="button" color={theme.palette.secondary.main}>
                {option.label}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                {option.description}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </TextField>

      <Dialog disableEscapeKeyDown open={open}>
        <DialogTitle>
          <Typography
            align="center"
            variant="button"
            color={theme.palette.secondary.main}
          >
            Thời gian giao hàng
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box textAlign={'center'}>
            <CustomTextField
              required
              fullWidth
              type="time"
              name="time_dialog"
              id="time_dialog"
              value={customTime}
              onChange={handleSetCustomTime}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => handleDialogClose('Hủy')}>
            <Typography variant="button" color={theme.palette.common.white}>
              Hủy
            </Typography>
          </CustomButton>
          <CustomButton onClick={() => handleDialogClose('Xác nhận')}>
            <Typography variant="button" color={theme.palette.common.white}>
              Xác nhận
            </Typography>
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChooseTime;
