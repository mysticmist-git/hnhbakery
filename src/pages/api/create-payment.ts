import dateFormat from 'dateformat';
import queryString from 'qs';
import crypto from 'crypto';

function sortObject(obj: any): any {
  var sorted: any = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

const numberSmallerTen = (theNumber: number) => {
  if (theNumber < 10) return '0' + theNumber;
  else return theNumber;
};

// const vnp_TmnCode = 'SLC8HSYX';
// const vnp_HashSecret = 'WEDDYNUFAGHXDZZYACHJPKQVIPNGUKCW';

const vnp_TmnCode = 'O8YBCQTU';
const vnp_HashSecret = 'EOHDCBBZGZLYFDLTNVCBPHBZUDZWNJBI';
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

var vnp_ReturnUrl = 'http://localhost:3000/payment-result';

const handler = async (req: any, res: any) => {
  try {
    var ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var tmnCode = vnp_TmnCode;
    var secretKey = vnp_HashSecret;
    var vnpUrl = vnp_Url;
    var returnUrl = vnp_ReturnUrl;

    var date = new Date();
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var HHmmss =
      '' +
      numberSmallerTen(date.getHours()) +
      numberSmallerTen(date.getMinutes()) +
      numberSmallerTen(date.getSeconds());
    var createDate =
      '' + yyyy + numberSmallerTen(mm) + numberSmallerTen(dd) + HHmmss;

    console.log(createDate);

    var orderId = req.body.billId;
    var amount = req.body.totalPrice;
    var bankCode = '';

    var orderInfo = req.body.paymentDescription;
    var orderType = 'topup';
    var locale = 'vn';

    var currCode = 'VND';
    var vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = queryString.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + queryString.stringify(vnp_Params, { encode: false });
  } catch (e) {
    return res.status(500).json({ error: `Unexpected error.${e}` });
  }
  return res.status(200).json({ success: true, url: vnpUrl });
};

export default handler;
