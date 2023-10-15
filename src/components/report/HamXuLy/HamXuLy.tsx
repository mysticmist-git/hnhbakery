// import { BillDetailObject, BillObject } from '@/lib/models';
import { dataRow } from '../ReportTable/ReportTable';
import { SanPhamDoanhThuType } from '@/pages/manager/reports';
import ReportTableRow from '@/models/report';
import { BillTableRow } from '@/models/bill';
import { BillItemTableRow } from '@/models/billItem';

function getRevenue(bills: BillTableRow[] | undefined) {
  if (!bills) {
    return 0;
  }
  return bills.reduce((total, bill) => total + bill.total_price, 0);
}

function getRealRevenue(bills: BillTableRow[] | undefined) {
  if (!bills) {
    return 0;
  }
  return bills.reduce((total, bill) => total + bill.final_price, 0);
}

function getNumberProducts(bills: BillTableRow[] | undefined) {
  if (!bills) {
    return 0;
  }
  var result = 0;
  bills.forEach((bill) => {
    bill.billItems?.forEach((billItem) => {
      result += billItem.amount;
    });
  });
  return result;
}

function handle(
  rows: dataRow[],
  spDoanhThu: SanPhamDoanhThuType[],
  handleRevenueChange: (value: number) => void,
  handleRealRevenueChange: (value: number) => void,
  handleSpDoanhThuChange: (value: SanPhamDoanhThuType[]) => void
) {
  const totalRevenue = rows.reduce((total, row) => total + row.revenue, 0);
  handleRevenueChange(totalRevenue);
  rows.forEach((row) => {
    row.percentage = Math.round(
      (row.revenue / (totalRevenue == 0 ? 1 : totalRevenue)) * 100
    );
  });

  const totalRealRevenue = rows.reduce(
    (total, row) => total + row.realRevenue,
    0
  );
  handleRealRevenueChange(totalRealRevenue);

  spDoanhThu.forEach((spDoanhThu) => {
    spDoanhThu.percentage = Math.round(
      (spDoanhThu.revenue / (totalRevenue == 0 ? 1 : totalRevenue)) * 100
    );
  });
  handleSpDoanhThuChange(spDoanhThu);
}

var spDoanhThu: SanPhamDoanhThuType[] = [];
var rows: dataRow[] = [];

function xuly(reportData: ReportTableRow, bills: BillTableRow[] | undefined) {
  bills?.forEach((bill) => {
    bill.billItems?.forEach((billDetail) => {
      var exist = spDoanhThu.findIndex((spDoanhThu) => {
        return spDoanhThu.id == billDetail.batch_id;
      });

      if (exist == -1) {
        const batch = reportData.batches?.find(
          (batch) => batch.id == billDetail.batch_id
        );
        const productType = reportData.productTypes?.find(
          (item) => item.id == batch?.product_type_id
        );
        const product = productType?.products?.find((product) => {
          return product.id == batch?.product_id;
        });
        if (product && batch) {
          spDoanhThu.push({
            ...batch,
            revenue: billDetail.final_price,
            percentage: 0,
            product: product,
          });
        }
      } else {
        spDoanhThu[exist].revenue =
          spDoanhThu[exist].revenue + billDetail.final_price;
      }
    });
  });
}

export function All_All_All({
  reportData,
  reportDate,
  handleRevenueChange,
  handleRealRevenueChange,
  handleSpDoanhThuChange,
}: {
  reportData: ReportTableRow;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThuType[]) => void;
}): dataRow[] {
  var minYear = new Date().getFullYear();
  var maxYear = new Date().getFullYear();
  reportData.bills?.forEach((bill) => {
    if (bill.state == 'paid') {
      var year = new Date(bill.paid_time).getFullYear();
      minYear = year < minYear ? year : minYear;
    }
  });

  rows = [];
  spDoanhThu = [];
  for (var i = minYear; i <= maxYear; i++) {
    const bills = reportData.bills?.filter(
      (bill) =>
        bill.state == 'paid' && new Date(bill.paid_time).getFullYear() == i
    );
    const sales = reportData.sales?.filter(
      (sale) => new Date(sale.start_at).getFullYear() == i
    );

    const revenue = getRevenue(bills);

    const realRevenue = getRealRevenue(bills);

    xuly(reportData, bills);

    const numberProducts = getNumberProducts(bills);

    rows.push({
      id: i.toString(),
      time: i.toString(),
      numberBills: bills ? bills.length : 0,
      numberProducts: numberProducts,
      numberSales: sales ? sales.length : 0,
      revenue: revenue,
      realRevenue: realRevenue,
      percentage: 0,
    });
  }

  handle(
    rows,
    spDoanhThu,
    handleRevenueChange,
    handleRealRevenueChange,
    handleSpDoanhThuChange
  );

  return rows;
}

export function All_So_All({
  reportData,
  reportDate,
  handleRevenueChange,
  handleRealRevenueChange,
  handleSpDoanhThuChange,
}: {
  reportData: ReportTableRow;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThuType[]) => void;
}): dataRow[] {
  var minYear = new Date().getFullYear();
  var maxYear = new Date().getFullYear();
  reportData.bills?.forEach((bill) => {
    if (bill.state == 'paid') {
      var year = new Date(bill.paid_time).getFullYear();
      minYear = year < minYear ? year : minYear;
    }
  });

  rows = [];
  spDoanhThu = [];
  for (var i = minYear; i <= maxYear; i++) {
    const bills = reportData.bills?.filter(
      (bill) =>
        bill.state == 'paid' &&
        new Date(bill.paid_time).getMonth() + 1 == reportDate.month &&
        new Date(bill.paid_time).getFullYear() == i
    );

    const sales = reportData.sales?.filter(
      (sale) =>
        new Date(sale.start_at).getMonth() + 1 == reportDate.month &&
        new Date(sale.start_at).getFullYear() == i
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    xuly(reportData, bills);

    const numberProducts = getNumberProducts(bills);

    rows.push({
      id:
        (reportDate.month < 10 ? '0' : '') +
        reportDate.month.toString() +
        '/' +
        i.toString(),
      time:
        (reportDate.month < 10 ? '0' : '') +
        reportDate.month.toString() +
        '/' +
        i.toString(),
      numberBills: bills ? bills.length : 0,
      numberProducts: numberProducts,
      numberSales: sales ? sales.length : 0,
      revenue: revenue,
      realRevenue: realRevenue,
      percentage: 0,
    });
  }

  handle(
    rows,
    spDoanhThu,
    handleRevenueChange,
    handleRealRevenueChange,
    handleSpDoanhThuChange
  );

  return rows;
}

export function All_All_So({
  reportData,
  reportDate,
  handleRevenueChange,
  handleRealRevenueChange,
  handleSpDoanhThuChange,
}: {
  reportData: ReportTableRow;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThuType[]) => void;
}): dataRow[] {
  var minMonth = 1;
  var maxMonth = 12;

  rows = [];
  spDoanhThu = [];
  for (var i = minMonth; i <= maxMonth; i++) {
    const bills = reportData.bills?.filter(
      (bill) =>
        bill.state == 'paid' &&
        new Date(bill.paid_time).getMonth() + 1 == i &&
        new Date(bill.paid_time).getFullYear() == reportDate.year
    );

    const sales = reportData.sales?.filter(
      (sale) =>
        new Date(sale.start_at).getMonth() + 1 == i &&
        new Date(sale.start_at).getFullYear() == reportDate.year
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    xuly(reportData, bills);

    const numberProducts = getNumberProducts(bills);

    rows.push({
      id: (i < 10 ? '0' : '') + i.toString() + '/' + reportDate.year.toString(),
      time:
        (i < 10 ? '0' : '') + i.toString() + '/' + reportDate.year.toString(),
      numberBills: bills ? bills.length : 0,
      numberProducts: numberProducts,
      numberSales: sales ? sales.length : 0,
      revenue: revenue,
      realRevenue: realRevenue,
      percentage: 0,
    });
  }

  handle(
    rows,
    spDoanhThu,
    handleRevenueChange,
    handleRealRevenueChange,
    handleSpDoanhThuChange
  );

  return rows;
}

export function All_So_So({
  reportData,
  reportDate,
  handleRevenueChange,
  handleRealRevenueChange,
  handleSpDoanhThuChange,
}: {
  reportData: ReportTableRow;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThuType[]) => void;
}): dataRow[] {
  var minDay = 1;
  var maxDay = new Date(reportDate.year, reportDate.month, 0).getDate();

  rows = [];
  spDoanhThu = [];
  for (var i = minDay; i <= maxDay; i++) {
    const bills = reportData.bills?.filter(
      (bill) =>
        bill.state == 'paid' &&
        new Date(bill.paid_time).getDate() == i &&
        new Date(bill.paid_time).getMonth() + 1 == reportDate.month &&
        new Date(bill.paid_time).getFullYear() == reportDate.year
    );

    const sales = reportData.sales?.filter(
      (sale) =>
        new Date(sale.start_at).getDate() == i &&
        new Date(sale.start_at).getMonth() + 1 == reportDate.month &&
        new Date(sale.start_at).getFullYear() == reportDate.year
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    xuly(reportData, bills);

    const numberProducts = getNumberProducts(bills);

    rows.push({
      id:
        (i < 10 ? '0' : '') +
        i.toString() +
        '/' +
        (reportDate.month < 10 ? '0' : '') +
        reportDate.month.toString() +
        '/' +
        reportDate.year.toString(),
      time:
        (i < 10 ? '0' : '') +
        i.toString() +
        '/' +
        (reportDate.month < 10 ? '0' : '') +
        reportDate.month.toString() +
        '/' +
        reportDate.year.toString(),
      numberBills: bills ? bills.length : 0,
      numberProducts: numberProducts,
      numberSales: sales ? sales.length : 0,
      revenue: revenue,
      realRevenue: realRevenue,
      percentage: 0,
    });
  }

  handle(
    rows,
    spDoanhThu,
    handleRevenueChange,
    handleRealRevenueChange,
    handleSpDoanhThuChange
  );

  return rows;
}

export function So_So_So({
  reportData,
  reportDate,
  handleRevenueChange,
  handleRealRevenueChange,
  handleSpDoanhThuChange,
}: {
  reportData: ReportTableRow;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThuType[]) => void;
}): dataRow[] {
  var minDay = reportDate.day;
  var maxDay = reportDate.day;

  rows = [];
  spDoanhThu = [];
  for (var i = minDay; i <= maxDay; i++) {
    const bills = reportData.bills?.filter(
      (bill) =>
        bill.state == 'paid' &&
        new Date(bill.paid_time).getDate() == i &&
        new Date(bill.paid_time).getMonth() + 1 == reportDate.month &&
        new Date(bill.paid_time).getFullYear() == reportDate.year
    );

    const sales = reportData.sales?.filter(
      (sale) =>
        new Date(sale.start_at).getDate() == i &&
        new Date(sale.start_at).getMonth() + 1 == reportDate.month &&
        new Date(sale.start_at).getFullYear() == reportDate.year
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    xuly(reportData, bills);

    const numberProducts = getNumberProducts(bills);

    rows.push({
      id:
        (i < 10 ? '0' : '') +
        i.toString() +
        '/' +
        (reportDate.month < 10 ? '0' : '') +
        reportDate.month.toString() +
        '/' +
        reportDate.year.toString(),
      time:
        (i < 10 ? '0' : '') +
        i.toString() +
        '/' +
        (reportDate.month < 10 ? '0' : '') +
        reportDate.month.toString() +
        '/' +
        reportDate.year.toString(),
      numberBills: bills ? bills.length : 0,
      numberProducts: numberProducts,
      numberSales: sales ? sales.length : 0,
      revenue: revenue,
      realRevenue: realRevenue,
      percentage: 0,
    });
  }

  handle(
    rows,
    spDoanhThu,
    handleRevenueChange,
    handleRealRevenueChange,
    handleSpDoanhThuChange
  );

  return rows;
}
