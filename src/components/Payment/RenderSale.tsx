import { Box, Checkbox, Grid, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import formatPrice from '@/utilities/formatCurrency';

function RenderSaleItem(props: any) {
  const theme = useTheme();
  const { sale, checkedSales, handleSetCheckedSales } = props;
  const { id, name, code, image, percentage, maxDiscountPrice, endDate } = sale;

  const [isHover, setIsHover] = useState(false);

  const handleSetISChecked = () => {
    handleSetCheckedSales(id);
  };

  const style = {
    normal: {
      objectFit: 'cover',
      transition: 'all 0.3s ease-in-out',
    },
    hover: {
      objectFit: 'cover',
      transition: 'all 0.3s ease-in-out',
      transform: 'scale(1.5) rotate(5deg)',
    },
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'start'}
          spacing={1}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <Grid item xs={5} alignSelf={'stretch'}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                minHeight: '96px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
              }}
            >
              <Box
                component={Image}
                src={image}
                alt={name}
                loading="lazy"
                fill={true}
                sx={isHover ? style.hover : style.normal}
              />
            </Box>
          </Grid>
          <Grid item xs={true}>
            <Grid
              container
              spacing={0.5}
              direction={'row'}
              alignItems={'start'}
              justifyContent={'center'}
              sx={{
                py: 0.5,
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                  }}
                  color={theme.palette.secondary.main}
                >
                  {name}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {'Mã code: ' + code}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {'Giảm: ' +
                    percentage * 100 +
                    '%, tối đa ' +
                    formatPrice(maxDiscountPrice)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {'Hạn sử dụng: ' + endDate}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={'auto'} alignSelf={'center'}>
            <Checkbox
              sx={{ color: theme.palette.secondary.main }}
              color="secondary"
              checked={
                checkedSales.find((item: any) => item.id === id)?.isChecked
              }
              onChange={handleSetISChecked}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
export function RenderSale(props: any) {
  const theme = useTheme();
  const { handleChooseSale } = props;
  const { Sales = [] } = props;
  const [checkedSales, setCheckedSales] = useState(
    Sales.map(function (sale: any) {
      return { id: sale.id, isChecked: false };
    }),
  );

  const handleSetCheckedSales = (id: number) => {
    setCheckedSales(
      checkedSales.map((sale: any) => {
        if (sale.id === id) {
          sale.isChecked = !sale.isChecked;
          if (sale.isChecked) {
            handleChooseSale(sale.id);
          } else {
            handleChooseSale('');
          }
        } else {
          sale.isChecked = false;
        }
        return sale;
      }),
    );
  };

  return (
    <>
      {Sales.map((sale: any, i: number) => (
        <RenderSaleItem
          key={i}
          sale={sale}
          checkedSales={checkedSales}
          handleSetCheckedSales={handleSetCheckedSales}
        />
      ))}
    </>
  );
}
