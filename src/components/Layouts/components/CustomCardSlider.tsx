import { useMediaQuery, Typography, Grid, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';

interface CardInfoType {
  image: string;
  name: string;
  description: string;
  href: string;
}

export default function CustomCardSlider(props: any) {
  const [itemsDisplay, setItemsDisplay] = useState<any[]>([]);
  const theme = useTheme();
  const {
    title,
    duration,
    CustomCard,
    imageHeight,
    imageWidth,
    descriptionHeight,
    productList = [],
    buttonOnclick = () => {},
  } = props;

  //#region UseEffects

  const oneColumn = useMediaQuery(theme.breakpoints.down('sm'));
  const twoColumn = useMediaQuery(theme.breakpoints.up('sm'));
  const threeColumn = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    let column = 1;

    if (threeColumn) {
      column = 3;
    } else if (twoColumn) {
      column = 2;
    } else if (oneColumn) {
      column = 1;
    }

    let listRow: any[] = [];
    let listColumn: CardInfoType[] = [];

    const bestSellerCount = productList.length;

    for (let i = 0; i < bestSellerCount; i++) {
      listColumn.push(productList[i] as CardInfoType);

      if ((i + 1) % column == 0 || i + 1 == productList.length) {
        listRow.push(listColumn);
        listColumn = [];
      }
    }
    if (listRow.length > 0) {
      let fillColumn = column - listRow[listRow.length - 1].length;
      for (let i = 0; i < fillColumn; i++) {
        listRow[listRow.length - 1].push({});
      }
    }

    setItemsDisplay(() => listRow);
  }, [productList, oneColumn, twoColumn, threeColumn]);

  //#endregion

  return (
    <>
      <Typography
        variant="h2"
        color={theme.palette.secondary.main}
        align={'center'}
      >
        {title}
      </Typography>
      <Box>
        <Carousel
          animation="slide"
          cycleNavigation={false}
          autoPlay={false}
          duration={duration}
          sx={{ pt: 4 }}
        >
          {itemsDisplay.map((listColumn, i) => (
            <Grid
              container
              key={i}
              direction={'row'}
              justifyContent={'center'}
              spacing={2}
              px={{ xs: 2, sm: 2, md: 4, lg: 8 }}
            >
              {listColumn.map((_item: any, i: React.Key | null | undefined) =>
                Object.keys(_item).length > 0 ? (
                  <Grid key={i} item xs={12 / listColumn.length}>
                    <Grid
                      container
                      justifyContent={'center'}
                      alignItems={'center'}
                      width={'100%'}
                    >
                      <CustomCard
                        imageHeight={imageHeight}
                        imageWidth={imageWidth}
                        descriptionHeight={descriptionHeight}
                        cardInfo={{
                          image: _item.image,
                          name: _item.name,
                          description: _item.description,
                          href: _item.href,
                        }}
                        buttonOnclick={buttonOnclick}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid key={i} item xs={12 / listColumn.length}></Grid>
                ),
              )}
            </Grid>
          ))}
        </Carousel>
      </Box>
    </>
  );
}
