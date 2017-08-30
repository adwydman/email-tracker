const expect = require('chai').expect;

const { sendResponse, generateTrackingObject, generateRecipientInfo, generateImage } = require('../app/lib/routesHelpers');

describe('routesHelpers', () => {
  describe('sendResponse', () => {
    it('responses with proper values', () => {
      const res = {
        status: (st) => expect(st).to.be.equal(200),
        setHeader: (contentType, value) => {
          expect(contentType).to.be.equal('Content-Type');
          expect(value).to.be.equal('application/json');
        },
        send: (content) => expect(content).to.be.equal('{value: 1}')
      };

      sendResponse(res, '{value: 1}', 200, 'application/json');
    });
  });
  describe('generateTrackingObject', () => {
    it('generates a proper recipient object', () => {
      const trackingObject = generateTrackingObject();
      expect(trackingObject).to.have.all.keys('emailAddress', 'emailId', 'imgElement');
    });
  });
  describe('generateRecipientInfo', () => {
    const req = {
      headers: {
        'x-forwarded-for': '1.2.3.4',
        'user-agent': 'agent'
      }
    };

    it('generates an object with recipient data', () => {
      const recipientInfo = generateRecipientInfo(req, '1234', true);
      expect(recipientInfo).to.have.all.keys('emailId', 'timestamp', 'ipAddress', 'userAgent', 'originallySentTo', 'reopened');
    });
  })
  describe('generateImage', () => {
    it('generates a proper buffer that represents an image', () => {
      const image = generateImage();
      expect(image instanceof Buffer).to.be.true;
    });
  })
});
