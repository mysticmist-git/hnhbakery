import { useSnackbarService } from '@/lib/contexts';
import { SanPhamDoanhThu } from '@/lib/models';
import { formatPrice } from '@/lib/utils';
import { ContentCopyRounded } from '@mui/icons-material';
import { InputAdornment, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomIconButton } from '../../buttons';
import Outlined_TextField from '../../order/MyModal/Outlined_TextField';

export default function SanPhamDoanhThu({
  spDoanhThu,
  spDoanhThuSearch,
}: {
  spDoanhThu: SanPhamDoanhThu[];
  spDoanhThuSearch: string;
}) {
  const theme = useTheme();
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };

  const [data, setData] = useState(spDoanhThu);

  useEffect(() => {
    setData(() => spDoanhThu);
  }, [spDoanhThu]);

  const getValue = (item: SanPhamDoanhThu) => {
    var result = '';
    result += 'Mã lô: ' + item.id;
    result += '\nMã sản phẩm: ' + item.productObject.id;
    result += '\nĐã bán: ' + item.soldQuantity;
    result += '\nDoanh thu: ' + formatPrice(item.revenue);
    result += '\nChiểm tỉ lệ: ' + item.percentage + '%';
    result +=
      '\nTrạng thái: ' +
      (item.productObject.isActive ? 'Còn sản xuất' : 'Ngưng sản xuất');

    return result;
  };

  const getLabel = (item: SanPhamDoanhThu) => {
    const variant = item.productObject.variants.find(
      (variant) => variant.id === item.variant_id
    );
    return (
      item.productObject.name +
      ' - ' +
      variant?.material +
      ' - Size: ' +
      variant?.size
    );
  };
  const handleSnackbarAlert = useSnackbarService();

  return (
    <>
      {data.map((item, index) => {
        return (
          <Outlined_TextField
            key={index}
            multiline
            textStyle={textStyle}
            label={getLabel(item)}
            value={getValue(item)}
            sx={{
              display:
                spDoanhThuSearch.trim() === '' ||
                getValue(item)
                  .toLocaleLowerCase()
                  .includes(spDoanhThuSearch.toLocaleLowerCase()) ||
                getLabel(item)
                  .toLocaleLowerCase()
                  .includes(spDoanhThuSearch.toLocaleLowerCase())
                  ? 'block'
                  : 'none',
            }}
            InputProps={{
              readOnly: true,
              style: {
                pointerEvents: 'auto',
                borderRadius: '8px',
              },
              endAdornment: item.productObject.id && (
                <InputAdornment position="end">
                  <CustomIconButton
                    edge="end"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        item.productObject.id ?? 'Trống'
                      );
                      handleSnackbarAlert(
                        'success',
                        'Đã sao chép mã sản phẩm vào clipboard!'
                      );
                    }}
                  >
                    <Tooltip title="Sao chép mã sản phẩm vào clipboard">
                      <ContentCopyRounded fontSize="small" />
                    </Tooltip>
                  </CustomIconButton>
                </InputAdornment>
              ),
            }}
          />
        );
      })}

      {data.length <= 0 && (
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          align="center"
        >
          Trống
        </Typography>
      )}
    </>
  );
}
