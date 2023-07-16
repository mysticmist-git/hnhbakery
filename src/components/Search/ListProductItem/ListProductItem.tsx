import { SearchContext } from '@/lib/contexts/search';
import { formatPrice } from '@/lib/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import React, { memo, useContext } from 'react';
import { Product, ProductContent } from '..';

//#endregion
//#region Danh sách sản phẩm
const ListProductItem = memo((props: any) => {
  const theme = useTheme();
  const context = useContext(SearchContext);

  return (
    <Grid
      container
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      width={'100%'}
    >
      <Grid item width={'100%'} sx={{ bgcolor: theme.palette.common.black }}>
        {context.productInfor.map((item: any, index: number) => (
          <Accordion
            key={index}
            sx={{
              '&.MuiPaper-root': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
              width: '100%',
            }}
            disableGutters
            defaultExpanded={index == 0 ? true : false}
          >
            <AccordionSummary
              sx={{
                bgcolor: theme.palette.primary.main,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.85,
                },
              }}
              expandIcon={
                <ExpandMoreIcon sx={{ color: theme.palette.text.secondary }} />
              }
            >
              <Grid container justifyContent={'center'} alignItems={'center'}>
                <Grid item xs="auto">
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={'inline'}
                  >
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        color={theme.palette.common.black}
                      >
                        {item.productDetail.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                      >
                        {'Size ' + item.bill_ProductDetail.size} +{' '}
                        {item.bill_ProductDetail.material}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={true} pr={2}>
                  <Grid
                    container
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Grid item xs={true}>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                        align="right"
                        noWrap
                      >
                        x {item.bill_ProductDetail.amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={'auto'} pl={{ sm: 4, xs: 2 }}>
                      <Typography
                        variant="body2"
                        color={theme.palette.common.black}
                      >
                        {formatPrice(item.bill_ProductDetail.price)}/bánh
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                bgcolor: theme.palette.common.white,
              }}
            >
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                spacing={1}
              >
                <ProductContent item={item} />
                <Product item={item} />
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
});

export default ListProductItem;
