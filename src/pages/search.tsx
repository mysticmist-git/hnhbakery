import {
  Box,
  Typography,
  alpha,
  Grid,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import banh1 from '../assets/Carousel/3.jpg';
export default function Search() {
  //#region Style
  const theme = useTheme();
  const styles = {
    text: {
      white: {
        color: theme.palette.common.white,
      },
      grey: {
        color: theme.palette.text.secondary,
      },
      black: {
        color: theme.palette.common.black,
      },
      primary: {
        color: theme.palette.secondary.main,
      },
    },
    gridDesktop: { display: { xs: 'none', lg: 'block' } },
    gridPhone: { display: { xs: 'block', lg: 'none' } },
  };
  //#endregion

  function CustomAccordionItem(props: any) {
    const heading = props.heading;
    const Content = props.content;
    return (
      <Accordion
        sx={{
          '&.MuiPaper-root': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          width: '100%',
        }}
        disableGutters
      >
        <AccordionSummary
          sx={{
            bgcolor: theme.palette.primary.main,
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: styles.text.grey }} />}
        >
          <Typography variant="button" color={styles.text.black}>
            {heading}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            bgcolor: theme.palette.common.white,
          }}
        >
          <Content />
        </AccordionDetails>
      </Accordion>
    );
  }

  function CustomAccordion(props: any) {
    const heading = props.heading;
    const Content = props.content;
    return (
      <Accordion
        sx={{
          '&.MuiPaper-root': {
            backgroundColor: 'transparent',
            borderRadius: '8px',
            boxShadow: 'none',
          },
          width: '100%',
        }}
        disableGutters
        defaultExpanded
      >
        <AccordionSummary
          sx={{
            bgcolor: theme.palette.secondary.main,
            borderRadius: '8px 8px 0px 0px',
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: styles.text.white }} />}
        >
          <Typography variant="button" color={styles.text.white}>
            {heading}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            bgcolor: theme.palette.common.white,
            border: 3,
            borderTop: 0,
            borderColor: theme.palette.secondary.main,
            borderRadius: '0 0 8px 8px',
            p: 0,
          }}
        >
          <Content />
        </AccordionDetails>
      </Accordion>
    );
  }

  function ListBillItem(props: any) {
    function ChiTietHoaDon(props: any) {
      return (
        <Grid container direction={'row'} justifyContent={'center'}>
          <Grid item xs={12}>
            <Grid
              container
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Grid item>
                <Typography variant="body2" color={styles.text.black}>
                  Mã hóa đơn:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="button" color={styles.text.black}>
                  GUEST-123
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid
        container
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Grid item width={'100%'}>
          <CustomAccordionItem
            heading="Chi tiết hóa đơn"
            content={ChiTietHoaDon}
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: '320px',
          backgroundImage: `url(${banh1.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: alpha(theme.palette.common.black, 0.6),
          }}
        >
          <Grid
            sx={{ px: 6 }}
            height={'100%'}
            container
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item>
              <a href="#">
                <Typography
                  align="center"
                  variant="h1"
                  color={theme.palette.primary.main}
                  sx={{
                    '&:hover': {
                      color: theme.palette.common.white,
                    },
                  }}
                >
                  Tìm kiếm
                </Typography>
              </a>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={{ pt: 8, px: { md: 8, xs: 3 } }}>
        <Typography align="center" variant="h1" color={styles.text.primary}>
          Tìm kiếm và tra cứu
        </Typography>
        <Typography align="center" variant="body2" color={styles.text.black}>
          Tìm kiếm loại bánh, tên bánh, mã hóa đơn, các chính sách, điều khoản
          dịch vụ, …
        </Typography>
        <Grid
          sx={{
            pt: 4,
          }}
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'start'}
          spacing={4}
        >
          <Grid item md={5} xs={12}>
            <CustomAccordion heading="Hóa đơn của bạn" content={ListBillItem} />
          </Grid>
          <Grid item md={7} xs={12}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}
