import { formatDateString } from '@/lib/utils';
import { billStateColorParse, billStateContentParse } from '@/models/bill';
import { UserTableRow } from '@/models/user';
import { ExpandMore, SearchRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import * as diacritics from 'diacritics';
import React, { useRef, useState } from 'react';
import { BillAccordionContent } from './BillAccordionContent';

export function Profile_Orders({
  userData,
}: {
  userData: UserTableRow | undefined;
}) {
  const theme = useTheme();

  //#region Search
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  //#endregion
  return (
    <Stack
      direction={'column'}
      spacing={2}
      sx={{
        width: '100%',
      }}
    >
      <Divider sx={{ mb: 2, mt: 4 }}>
        <Chip label="ĐƠN HÀNG CỦA BẠN" color="secondary" />
      </Divider>

      <Box component={'div'}>
        <TextField
          ref={searchInput}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size="medium"
          fullWidth
          variant="outlined"
          color="secondary"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="inherit" />
              </InputAdornment>
            ),
            sx: {
              fontSize: 'body1.fontSize',
              backgroundColor: 'white',
              overflow: 'hidden',
              boxShadow: 3,
              px: 2,
              borderRadius: '40px',
              '&:hover': {},
            },
          }}
          placeholder="Tìm kiếm theo mã hóa đơn, ngày giờ đặt, trạng thái"
          sx={{
            '& fieldset': {
              border: 'none',
            },
          }}
        />
      </Box>

      {userData?.bills
        ?.filter((bill) => {
          if (searchValue === '') {
            return true;
          }

          const searchstr = diacritics.remove(searchValue.toLowerCase());

          if (bill.id?.toLowerCase().includes(searchstr)) {
            return true;
          }

          if (formatDateString(bill.created_at).includes(searchstr)) {
            return true;
          }
          const billState = diacritics.remove(
            billStateContentParse(bill.state).toLocaleLowerCase()
          );

          if (billState.includes(searchstr)) {
            return true;
          }
        })
        .map((bill, i) => {
          return (
            <>
              <Accordion
                key={bill.id}
                sx={{
                  border: 1,
                  borderColor: 'black',
                  boxShadow: 0,
                  '&.MuiAccordion-rounded': {
                    borderRadius: 3,
                  },
                  backgroundColor: 'transparent',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={4}>
                      <Typography variant="button" fontWeight={'regular'}>
                        {i + 1 + '/ '} Mã hóa đơn: {bill.id}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Box component={'div'}>
                        <Typography
                          variant="body2"
                          fontWeight={'regular'}
                          sx={{
                            flexGrow: 1,
                            textAlign: 'center',
                          }}
                        >
                          Thời gian đặt: {formatDateString(bill.created_at)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box component={'div'}>
                        <Typography
                          variant="body2"
                          fontWeight={'bold'}
                          sx={{
                            color: billStateColorParse(theme, bill.state),
                            textAlign: 'center',
                            width: '100%',
                          }}
                        >
                          {billStateContentParse(bill.state)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <BillAccordionContent bill={bill} />
                </AccordionDetails>
              </Accordion>
            </>
          );
        })}

      {(!userData?.bills || userData?.bills?.length == 0) && (
        <Typography
          align="center"
          variant="body2"
          color={theme.palette.common.black}
        >
          Chưa có đơn hàng nào
        </Typography>
      )}
    </Stack>
  );
}
