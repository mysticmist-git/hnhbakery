import {
  BillDetailObject,
  BillObject,
  SanPhamDoanhThu,
  SuperDetail_ReportObject,
} from '@/lib/models';
import { dataRow } from '../ReportTable/ReportTable';

function getRevenue(bills: BillObject[]) {
  return bills.reduce((total, bill) => total + bill.originalPrice, 0);
}

function getRealRevenue(bills: BillObject[]) {
  return bills.reduce((total, bill) => total + bill.totalPrice, 0);
}

function getBillDetails(billDetails: BillDetailObject[], bills: BillObject[]) {
  return billDetails.filter((billDetail) => {
    return bills.findIndex((bill) => bill.id == billDetail.bill_id) != -1;
  });
}
function getNumberProducts(billDetails: BillDetailObject[]) {
  return billDetails.reduce(
    (total, billDetail) => total + billDetail.amount,
    0
  );
}

function handle(
  rows: dataRow[],
  spDoanhThu: SanPhamDoanhThu[],
  handleRevenueChange: (value: number) => void,
  handleRealRevenueChange: (value: number) => void,
  handleSpDoanhThuChange: (value: SanPhamDoanhThu[]) => void
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

export function All_All_All({
  reportData,
  reportDate,
  handleRevenueChange,
  handleRealRevenueChange,
  handleSpDoanhThuChange,
}: {
  reportData: SuperDetail_ReportObject;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThu[]) => void;
}): dataRow[] {
  var minYear = new Date().getFullYear();
  var maxYear = new Date().getFullYear();
  reportData.bills.forEach((bill) => {
    if (bill.state == 1) {
      var year = new Date(bill.paymentTime).getFullYear();
      minYear = year < minYear ? year : minYear;
    }
  });

  var rows: dataRow[] = [];
  var spDoanhThu: SanPhamDoanhThu[] = [];
  for (var i = minYear; i <= maxYear; i++) {
    const bills = reportData.bills.filter(
      (bill) => bill.state == 1 && new Date(bill.paymentTime).getFullYear() == i
    );
    const sales = reportData.sales.filter(
      (sale) => new Date(sale.start_at).getFullYear() == i
    );

    const revenue = getRevenue(bills);

    const realRevenue = getRealRevenue(bills);

    const billDetails = getBillDetails(reportData.billDetails, bills);

    billDetails.forEach((billDetail) => {
      var exist = spDoanhThu.findIndex((spDoanhThu) => {
        return spDoanhThu.id == billDetail.batch_id;
      });

      if (exist == -1) {
        const batch = reportData.batches.find(
          (batch) => batch.id == billDetail.batch_id
        );
        const productObject = reportData.products.find((product) => {
          return product.id == batch?.product_id;
        });
        if (productObject && batch) {
          spDoanhThu.push({
            ...batch,
            revenue:
              billDetail.amount *
              (billDetail.price - billDetail.discountAmount),
            percentage: 0,
            productObject: productObject,
          });
        }
      } else {
        spDoanhThu[exist].revenue =
          spDoanhThu[exist].revenue +
          billDetail.amount * (billDetail.price - billDetail.discountAmount);
      }
    });

    const numberProducts = getNumberProducts(billDetails);

    rows.push({
      id: i.toString(),
      time: i.toString(),
      numberBills: bills.length,
      numberProducts: numberProducts,
      numberSales: sales.length,
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
  reportData: SuperDetail_ReportObject;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThu[]) => void;
}): dataRow[] {
  var minYear = new Date().getFullYear();
  var maxYear = new Date().getFullYear();
  reportData.bills.forEach((bill) => {
    if (bill.state == 1) {
      var year = new Date(bill.paymentTime).getFullYear();
      minYear = year < minYear ? year : minYear;
    }
  });

  var rows: dataRow[] = [];
  var spDoanhThu: SanPhamDoanhThu[] = [];
  for (var i = minYear; i <= maxYear; i++) {
    const bills = reportData.bills.filter(
      (bill) =>
        bill.state == 1 &&
        new Date(bill.paymentTime).getMonth() + 1 == reportDate.month &&
        new Date(bill.paymentTime).getFullYear() == i
    );

    const sales = reportData.sales.filter(
      (sale) =>
        new Date(sale.start_at).getMonth() + 1 == reportDate.month &&
        new Date(sale.start_at).getFullYear() == i
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    const billDetails = getBillDetails(reportData.billDetails, bills);

    billDetails.forEach((billDetail) => {
      var exist = spDoanhThu.findIndex((spDoanhThu) => {
        return spDoanhThu.id == billDetail.batch_id;
      });

      if (exist == -1) {
        const batch = reportData.batches.find(
          (batch) => batch.id == billDetail.batch_id
        );
        const productObject = reportData.products.find((product) => {
          return product.id == batch?.product_id;
        });
        if (productObject && batch) {
          spDoanhThu.push({
            ...batch,
            revenue:
              billDetail.amount *
              (billDetail.price - billDetail.discountAmount),
            percentage: 0,
            productObject: productObject,
          });
        }
      } else {
        spDoanhThu[exist].revenue =
          spDoanhThu[exist].revenue +
          billDetail.amount * (billDetail.price - billDetail.discountAmount);
      }
    });

    const numberProducts = getNumberProducts(billDetails);

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
      numberBills: bills.length,
      numberProducts: numberProducts,
      numberSales: sales.length,
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
  reportData: SuperDetail_ReportObject;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThu[]) => void;
}): dataRow[] {
  var minMonth = 1;
  var maxMonth = 12;

  var rows: dataRow[] = [];
  var spDoanhThu: SanPhamDoanhThu[] = [];
  for (var i = minMonth; i <= maxMonth; i++) {
    const bills = reportData.bills.filter(
      (bill) =>
        bill.state == 1 &&
        new Date(bill.paymentTime).getMonth() + 1 == i &&
        new Date(bill.paymentTime).getFullYear() == reportDate.year
    );

    const sales = reportData.sales.filter(
      (sale) =>
        new Date(sale.start_at).getMonth() + 1 == i &&
        new Date(sale.start_at).getFullYear() == reportDate.year
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    const billDetails = getBillDetails(reportData.billDetails, bills);

    billDetails.forEach((billDetail) => {
      var exist = spDoanhThu.findIndex((spDoanhThu) => {
        return spDoanhThu.id == billDetail.batch_id;
      });

      if (exist == -1) {
        const batch = reportData.batches.find(
          (batch) => batch.id == billDetail.batch_id
        );
        const productObject = reportData.products.find((product) => {
          return product.id == batch?.product_id;
        });
        if (productObject && batch) {
          spDoanhThu.push({
            ...batch,
            revenue:
              billDetail.amount *
              (billDetail.price - billDetail.discountAmount),
            percentage: 0,
            productObject: productObject,
          });
        }
      } else {
        spDoanhThu[exist].revenue =
          spDoanhThu[exist].revenue +
          billDetail.amount * (billDetail.price - billDetail.discountAmount);
      }
    });

    const numberProducts = getNumberProducts(billDetails);

    rows.push({
      id: (i < 10 ? '0' : '') + i.toString() + '/' + reportDate.year.toString(),
      time:
        (i < 10 ? '0' : '') + i.toString() + '/' + reportDate.year.toString(),
      numberBills: bills.length,
      numberProducts: numberProducts,
      numberSales: sales.length,
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
  reportData: SuperDetail_ReportObject;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThu[]) => void;
}): dataRow[] {
  var minDay = 1;
  var maxDay = new Date(reportDate.year, reportDate.month, 0).getDate();

  var rows: dataRow[] = [];
  var spDoanhThu: SanPhamDoanhThu[] = [];
  for (var i = minDay; i <= maxDay; i++) {
    const bills = reportData.bills.filter(
      (bill) =>
        bill.state == 1 &&
        new Date(bill.paymentTime).getDate() == i &&
        new Date(bill.paymentTime).getMonth() + 1 == reportDate.month &&
        new Date(bill.paymentTime).getFullYear() == reportDate.year
    );

    const sales = reportData.sales.filter(
      (sale) =>
        new Date(sale.start_at).getDate() == i &&
        new Date(sale.start_at).getMonth() + 1 == reportDate.month &&
        new Date(sale.start_at).getFullYear() == reportDate.year
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    const billDetails = getBillDetails(reportData.billDetails, bills);

    billDetails.forEach((billDetail) => {
      var exist = spDoanhThu.findIndex((spDoanhThu) => {
        return spDoanhThu.id == billDetail.batch_id;
      });

      if (exist == -1) {
        const batch = reportData.batches.find(
          (batch) => batch.id == billDetail.batch_id
        );
        const productObject = reportData.products.find((product) => {
          return product.id == batch?.product_id;
        });
        if (productObject && batch) {
          spDoanhThu.push({
            ...batch,
            revenue:
              billDetail.amount *
              (billDetail.price - billDetail.discountAmount),
            percentage: 0,
            productObject: productObject,
          });
        }
      } else {
        spDoanhThu[exist].revenue =
          spDoanhThu[exist].revenue +
          billDetail.amount * (billDetail.price - billDetail.discountAmount);
      }
    });

    const numberProducts = getNumberProducts(billDetails);

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
      numberBills: bills.length,
      numberProducts: numberProducts,
      numberSales: sales.length,
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
  reportData: SuperDetail_ReportObject;
  reportDate: { day: number; month: number; year: number };
  handleRevenueChange: (value: number) => void;
  handleRealRevenueChange: (value: number) => void;
  handleSpDoanhThuChange: (value: SanPhamDoanhThu[]) => void;
}): dataRow[] {
  var minDay = reportDate.day;
  var maxDay = reportDate.day;

  var rows: dataRow[] = [];
  var spDoanhThu: SanPhamDoanhThu[] = [];
  for (var i = minDay; i <= maxDay; i++) {
    const bills = reportData.bills.filter(
      (bill) =>
        bill.state == 1 &&
        new Date(bill.paymentTime).getDate() == i &&
        new Date(bill.paymentTime).getMonth() + 1 == reportDate.month &&
        new Date(bill.paymentTime).getFullYear() == reportDate.year
    );

    const sales = reportData.sales.filter(
      (sale) =>
        new Date(sale.start_at).getDate() == i &&
        new Date(sale.start_at).getMonth() + 1 == reportDate.month &&
        new Date(sale.start_at).getFullYear() == reportDate.year
    );

    const revenue = getRevenue(bills);
    const realRevenue = getRealRevenue(bills);

    const billDetails = getBillDetails(reportData.billDetails, bills);

    billDetails.forEach((billDetail) => {
      var exist = spDoanhThu.findIndex((spDoanhThu) => {
        return spDoanhThu.id == billDetail.batch_id;
      });

      if (exist == -1) {
        const batch = reportData.batches.find(
          (batch) => batch.id == billDetail.batch_id
        );
        const productObject = reportData.products.find((product) => {
          return product.id == batch?.product_id;
        });
        if (productObject && batch) {
          spDoanhThu.push({
            ...batch,
            revenue:
              billDetail.amount *
              (billDetail.price - billDetail.discountAmount),
            percentage: 0,
            productObject: productObject,
          });
        }
      } else {
        spDoanhThu[exist].revenue =
          spDoanhThu[exist].revenue +
          billDetail.amount * (billDetail.price - billDetail.discountAmount);
      }
    });

    const numberProducts = getNumberProducts(billDetails);

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
      numberBills: bills.length,
      numberProducts: numberProducts,
      numberSales: sales.length,
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
