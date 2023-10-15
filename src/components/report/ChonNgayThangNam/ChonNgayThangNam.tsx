import { Box, MenuItem, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Outlined_TextField from '../../order/MyModal/Outlined_TextField';
import ReportTableRow from '@/models/report';

export default function ChonNgayThangNam({
  reportData,
  reportDate,
  handleReportDateChange,
}: {
  reportData: ReportTableRow;
  reportDate: {
    day: number;
    month: number;
    year: number;
  };
  handleReportDateChange: (day: number, month: number, year: number) => void;
}) {
  const theme = useTheme();
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };

  const [days, setDays] = useState<number[]>([0]);
  const [months, setMonths] = useState<number[]>([0]);
  const [years, setYears] = useState<number[]>([0]);

  useEffect(() => {
    var minYear = new Date().getFullYear();
    var maxYear = new Date().getFullYear();

    reportData.bills!.forEach((bill) => {
      if (bill.state == 'paid') {
        var year = new Date(bill.paid_time).getUTCFullYear();
        minYear = year < minYear ? year : minYear;
      }
    });

    var finalYears = [0];
    for (var i = minYear; i <= maxYear; i++) {
      finalYears.push(i);
    }
    setYears(() => finalYears);

    setMonths(() => Array.from({ length: 13 }, (_, i) => i));
    if (reportDate.month > 0 && reportDate.year > 0) {
      setDays(() =>
        Array.from(
          {
            length:
              new Date(reportDate.year, reportDate.month, 0).getDate() + 1,
          },
          (_, i) => i
        )
      );
    } else {
      setDays(() => [0]);
    }
  }, [reportData.bills, reportDate.month, reportDate.year]);

  useEffect(() => {
    if (reportDate.month > 0 && reportDate.year > 0) {
      const maxDay = new Date(reportDate.year, reportDate.month, 0).getDate();
      setDays(() =>
        Array.from(
          {
            length: maxDay + 1,
          },
          (_, i) => i
        )
      );
      if (reportDate.day > maxDay) {
        handleReportDateChange(maxDay, reportDate.month, reportDate.year);
      }
    } else {
      setDays(() => [0]);
      handleReportDateChange(0, reportDate.month, reportDate.year);
    }
  }, [
    handleReportDateChange,
    reportDate.day,
    reportDate.month,
    reportDate.year,
  ]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Outlined_TextField
          textStyle={textStyle}
          label="Ngày"
          select
          color="secondary"
          InputProps={{
            readOnly: false,
            style: {
              pointerEvents: 'auto',
              borderRadius: '8px',
            },
          }}
          value={reportDate.day}
          onChange={(e: { target: { value: number } }) => {
            handleReportDateChange(
              e.target.value,
              reportDate.month,
              reportDate.year
            );
          }}
        >
          {days.map((day, index) => (
            <MenuItem key={index} value={day}>
              <Typography variant="body2" color={theme.palette.common.black}>
                {day == 0 ? 'Tất cả' : 'Ngày ' + day}
              </Typography>
            </MenuItem>
          ))}
        </Outlined_TextField>

        <Outlined_TextField
          textStyle={textStyle}
          label="Tháng"
          select
          color="secondary"
          InputProps={{
            readOnly: false,
            style: {
              pointerEvents: 'auto',
              borderRadius: '8px',
            },
          }}
          value={reportDate.month}
          onChange={(e: { target: { value: number } }) => {
            handleReportDateChange(
              reportDate.day,
              e.target.value,
              reportDate.year
            );
          }}
        >
          {months.map((month, index) => (
            <MenuItem key={index} value={month}>
              <Typography variant="body2" color={theme.palette.common.black}>
                {month == 0 ? 'Tất cả' : 'Tháng ' + month}
              </Typography>
            </MenuItem>
          ))}
        </Outlined_TextField>

        <Outlined_TextField
          textStyle={textStyle}
          label="Năm"
          select
          color="secondary"
          InputProps={{
            readOnly: false,
            style: {
              pointerEvents: 'auto',
              borderRadius: '8px',
            },
          }}
          value={reportDate.year}
          onChange={(e: { target: { value: number } }) => {
            handleReportDateChange(
              reportDate.day,
              reportDate.month,
              e.target.value
            );
          }}
        >
          {years.map((year, index) => (
            <MenuItem key={index} value={year}>
              <Typography variant="body2" color={theme.palette.common.black}>
                {year == 0 ? 'Tất cả' : 'Năm ' + year}
              </Typography>
            </MenuItem>
          ))}
        </Outlined_TextField>
      </Box>
    </>
  );
}
