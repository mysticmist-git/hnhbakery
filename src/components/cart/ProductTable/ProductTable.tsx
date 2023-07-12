import {
  Box,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';

function resolveBatchMax(total?: number, sold?: number) {
  if (!total || !sold) return 1;

  return total - sold;
}

const headingTable = [
  'Sản phẩm',
  'Giá tiền /sản phẩm',
  'Số lượng',
  'Tổng',
  'Xóa',
];

type ProductTableProps = {
  items: AssembledCartItem[];
  onChange: (items: AssembledCartItem[]) => void;
};

function ProductTable({ items, onChange }: ProductTableProps) {
  const theme = useTheme();
  const imageHeight = '20vh';

  const handleDeleteRow = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: theme.palette.common.white,
          borderRadius: '8px',
          border: 3,
          borderColor: theme.palette.secondary.main,
          marginTop: 1,
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              bgcolor: theme.palette.secondary.main,
            }}
          >
            <TableRow>
              {headingTable.map((item, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{ minWidth: i == 2 ? '255px' : '0px' }}
                >
                  <Typography
                    variant="body1"
                    color={theme.palette.common.white}
                  >
                    {item}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" align="center">
                  <Grid
                    container
                    direction={'row'}
                    alignItems={'center'}
                    spacing={0}
                    justifyContent={'center'}
                  >
                    <Grid item xs={12} pb={1}>
                      <Link href={item.href}>
                        <Box
                          sx={{
                            width: '100%',
                            height: imageHeight,
                            border: 3,
                            borderColor: theme.palette.secondary.main,
                            overflow: 'hidden',
                            borderRadius: '8px',
                            position: 'relative',
                          }}
                        >
                          <Box
                            component={Image}
                            src={item.image ?? ''}
                            alt={'Image for cart item'}
                            loading="lazy"
                            fill={true}
                            sx={{
                              objectFit: 'cover',
                              cursor: 'pointer',
                              transition: 'transform 0.3s ease-in-out',
                              ':hover': {
                                transform: 'scale(1.3) rotate(5deg)',
                              },
                            }}
                          />
                        </Box>
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Name name={item.product?.name} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_SizeMaterial row={item} />
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align="center">
                  <UI_Price row={item} />
                </TableCell>
                <TableCell align="center">
                  <UI_Quantity
                    value={item.quantity}
                    min={1}
                    max={resolveBatchMax(
                      item.batch?.totalQuantity,
                      item.batch?.soldQuantity
                    )}
                    onChange={(quantity: number) => {
                      onChange(
                        items.map((item) => {
                          if (item.id !== item.id) return item;

                          return {
                            ...item,
                            quantity,
                          };
                        })
                      );
                    }}
                    justifyContent={'center'}
                  />
                </TableCell>
                <TableCell align="center">
                  <UI_TotalPrice row={item} />
                </TableCell>
                <TableCell align="center">
                  <UI_Delete row={item} onDelete={handleDeleteRow} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        spacing={2}
        sx={{
          display: {
            xs: 'block',
            md: 'none',
          },
        }}
      >
        {productBill.map((row: any, index: number) => (
          <Grid item xs={12} key={index}>
            <Box
              sx={{
                border: 3,
                borderColor: theme.palette.secondary.main,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                spacing={2}
              >
                <Grid item xs={5} alignSelf={'stretch'}>
                  <Link href={row.href}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <Box
                        component={Image}
                        src={row.image}
                        alt={row.name}
                        loading="lazy"
                        fill={true}
                        sx={{
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease-in-out',
                          ':hover': {
                            transform: 'scale(1.3) rotate(5deg)',
                          },
                        }}
                      />
                    </Box>
                  </Link>
                </Grid>
                <Grid item xs={7}>
                  <Grid
                    container
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    spacing={0.5}
                    sx={{
                      py: 1,
                    }}
                  >
                    <Grid item xs={12}>
                      <UI_Name row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_SizeMaterial row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Price row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Quantity row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_TotalPrice row={row} />
                    </Grid>
                    <Grid item xs={12}>
                      <UI_Delete row={row} onDelete={handleDeleteRow} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ProductTable;
