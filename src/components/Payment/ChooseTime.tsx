import {
  TextField,
  Typography,
  useTheme,
  alpha,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import CustomTextField from '@/components/Inputs/CustomTextField';
import CustomButton from '@/components/Inputs/Buttons/customButton';

const options = [
  {
    value: 'Buổi sáng (07:30 - 11:30)',
    label: 'Buổi sáng',
    description: '(07:30 - 11:30)',
  },
  {
    value: 'Buổi trưa (11:30 - 13:00)',
    label: 'Buổi trưa',
    description: '(11:30 - 13:00)',
  },
  {
    value: 'Buổi chiều (13:00 - 17:00)',
    label: 'Buổi chiều',
    description: '(13:00 - 17:00)',
  },
  {
    value: 'Buổi tối (17:00 - 21:00)',
    label: 'Buổi tối',
    description: '(17:00 - 21:00)',
  },
  {
    value: 'Cụ thể',
    label: 'Cụ thể',
    description: 'Chọn mốc thời gian',
  },
];

export const ChooseTime = (props: any) => {
  const theme = useTheme();

  const { handleSetThoiGianGiao } = props;

  const [selectedOption, setSelectedOption] = useState('');
  const [open, setOpen] = useState(false);
  let realTime = '';
  const [customTime, setCustomTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );

  const handleSetSelectedOption = (event: any) => {
    if (event.target.value != options[options.length - 1].value) {
      setSelectedOption(event.target.value);
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
      options[options.length - 1].value = realTime;
      options[options.length - 1].label = realTime;
      options[options.length - 1].description = 'Thời gian cụ thể';
      setSelectedOption(options[options.length - 1].value);
      handleSetThoiGianGiao(options[options.length - 1].value);
    }
  };

  return (
    <>
      <TextField
        {...props}
        value={selectedOption}
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
                0.3,
              )}`,
            },
            '&:focus': {
              backgroundColor: theme.palette.common.white,
              boxShadow: `0px 0px 5px 2px ${alpha(
                theme.palette.secondary.main,
                0.3,
              )}`,
            },
          },
        }}
      >
        {options.map((option: any) => (
          <MenuItem
            key={option.value}
            value={option.value}
            onClick={
              option.value == options[options.length - 1].value
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
          <CustomButton
            onClick={() => handleDialogClose('Hủy')}
            children={() => (
              <Typography variant="button" color={theme.palette.common.white}>
                Hủy
              </Typography>
            )}
          />
          <CustomButton
            onClick={() => handleDialogClose('Xác nhận')}
            children={() => (
              <Typography variant="button" color={theme.palette.common.white}>
                Xác nhận
              </Typography>
            )}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
