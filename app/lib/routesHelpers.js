const shortid = require('shortid');

const baseUrl = 'http://localhost:3000';
const emailAddress = 'hello@precognitive.io';

const sendResponse = (res, content, status, contentType = 'application/json') => {
  res.status(status);
  res.setHeader('Content-Type', contentType);
  res.send(content);
}

const generateTrackingObject = () => {
  const emailId = shortid.generate(); // unique id linked to the email address
  const imgElement = `<img src="${baseUrl}/${emailId}/tracker.png">`; // HTML image element to embed inside the email
  return { emailAddress, emailId, imgElement }; // response sent to the User
}

const generateRecipientInfo = (req, emailId, reopened) => {
  return {
    emailId: emailId,
    timestamp: Date.now(),
    ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    originallySentTo: emailAddress,
    reopened: reopened
  };
}

const generateImage = () => {
  return new Buffer([ // image to be embedded inside the email
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
    0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
    0x02, 0x44, 0x01, 0x00, 0x3b
  ]);
}

module.exports = { sendResponse, generateTrackingObject, generateRecipientInfo, generateImage };
