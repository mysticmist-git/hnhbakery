import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { memo } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { CustomIconButton } from '../Inputs/Buttons';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

function CheckboxList(props: any) {
  const { textStyle } = props;
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const theme = useTheme();
  return (
    <List sx={{ width: '100%', p: 0, m: 0 }}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value} sx={{ px: 0, py: 2 }}>
            <ListItemButton
              sx={{ p: 0, mr: 1 }}
              role={undefined}
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  color="secondary"
                  sx={{
                    color: theme.palette.secondary.main,
                  }}
                />
              </ListItemIcon>
            </ListItemButton>
            <TextField
              id={labelId}
              label="Địa chỉ 1"
              disabled
              variant="outlined"
              defaultValue={'123 Nguyễn Hữu Hùng, Hà Nội, Việt Nam'}
              fullWidth
              InputProps={{
                style: {
                  borderRadius: '8px',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomIconButton
                      sx={{
                        color: theme.palette.common.black,
                      }}
                    >
                      <EditRoundedIcon fontSize="small" />
                    </CustomIconButton>
                    <CustomIconButton
                      sx={{
                        color: theme.palette.success.main,
                      }}
                    >
                      <CheckRoundedIcon fontSize="medium" />
                    </CustomIconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                sx: {
                  ...textStyle,
                },
              }}
              type="text"
            />
          </ListItem>
        );
      })}
    </List>
  );
}

const RightProfileColumn = () => {
  const theme = useTheme();
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 3,
            px: 2,
            py: 2,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                align="center"
                variant="button"
                color={theme.palette.common.black}
              >
                Thông tin cá nhân
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Họ và tên"
                disabled
                variant="outlined"
                defaultValue={'Nguyễn Hữu Hùng'}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '8px',
                  },
                }}
                inputProps={{
                  sx: {
                    ...textStyle,
                  },
                }}
                type="text"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Ngày sinh"
                disabled
                views={['day', 'month', 'year']}
                sx={{
                  width: '100%',
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    InputProps: {
                      style: {
                        borderRadius: '8px',
                      },
                    },
                    inputProps: {
                      sx: {
                        ...textStyle,
                      },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 3,
            p: 2,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                align="center"
                variant="button"
                color={theme.palette.common.black}
              >
                Bảo mật
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                disabled
                variant="outlined"
                defaultValue={'phantruong0701@gmail.com'}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '8px',
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <CustomIconButton
                        sx={{
                          color: theme.palette.common.black,
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </CustomIconButton>
                      <CustomIconButton
                        sx={{
                          color: theme.palette.success.main,
                        }}
                      >
                        <CheckRoundedIcon fontSize="medium" />
                      </CustomIconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  sx: {
                    ...textStyle,
                  },
                }}
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Số điện thoại"
                disabled
                variant="outlined"
                defaultValue={'0343214971'}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        variant="button"
                        color={theme.palette.text.secondary}
                      >
                        +84
                      </Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <CustomIconButton
                        sx={{
                          color: theme.palette.common.black,
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </CustomIconButton>
                      <CustomIconButton
                        sx={{
                          color: theme.palette.success.main,
                        }}
                      >
                        <CheckRoundedIcon fontSize="medium" />
                      </CustomIconButton>
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: '8px',
                  },
                }}
                inputProps={{
                  sx: {
                    ...textStyle,
                  },
                }}
                type="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mật khẩu"
                disabled
                variant="outlined"
                defaultValue={'1234567890'}
                fullWidth
                InputProps={{
                  style: {
                    borderRadius: '8px',
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <CustomIconButton
                        sx={{
                          color: theme.palette.common.black,
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </CustomIconButton>
                      <CustomIconButton
                        sx={{
                          color: theme.palette.success.main,
                        }}
                      >
                        <CheckRoundedIcon fontSize="medium" />
                      </CustomIconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  sx: {
                    ...textStyle,
                  },
                }}
                type="password"
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 3,
            p: 2,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <Box
                display={'flex'}
                justifyContent="space-between"
                alignItems="center"
                flexDirection={'row'}
              >
                <Typography
                  align="center"
                  variant="button"
                  color={theme.palette.common.black}
                >
                  Địa chỉ giao hàng
                </Typography>
                <CustomIconButton sx={{ color: theme.palette.secondary.main }}>
                  <DeleteRoundedIcon fontSize="small" />
                </CustomIconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <CheckboxList textStyle={textStyle} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default memo(RightProfileColumn);
