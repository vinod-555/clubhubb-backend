// helpers/qrCodeHelper.js

import qrcode from 'qrcode';

const generateQRCode = async (data) => {
  try {
    const qrCodeText = JSON.stringify(data);
    const qrCodeImage = await qrcode.toDataURL(qrCodeText);
    return qrCodeImage;
  } catch (error) {
    throw new Error('Error generating QR code');
  }
};

export default generateQRCode;
