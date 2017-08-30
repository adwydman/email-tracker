const EventEmitter = require('events');
const appEmitter = new EventEmitter();

const db = require('./database');
const dbUrl = 'mongodb://localhost:27017/tracking';
db.connect(dbUrl);

const { sendResponse, generateTrackingObject, generateRecipientInfo, generateImage } = require('../lib/routesHelpers');

// User recieves an email address and the img url to embed the email
const recipient = (req, res) => {
  const { emailAddress, emailId, imgElement } = generateTrackingObject();

  db.insert('trackers', {emailId, emailAddress})
    .then( () => sendResponse(res, JSON.stringify({emailAddress, imgElement}), 200) )
    .catch( err => sendResponse(res, JSON.stringify({error: 'An error occured'}), 500) );
};

// Request sent when the image is loaded
const tracker = (req, res) => {
  const emailId = req.params.id; // unique id associated to an email
  let reopened = false; // indicates whether the email was opened more than once

  db.findEntry('recipients', {emailId})
    .then( result => {
      if (result !== null) reopened = true;
      return db.findEntry('trackers', {emailId})
    })
    .then( entry => {
      if (entry === null) {
        sendResponse(res, JSON.stringify({error: 'The id was not found'}), 404);
        return;
      }

      const recipientInfo = generateRecipientInfo(req, emailId, reopened);
      sendResponse(res, generateImage(), 200, 'image/png');
      appEmitter.emit('event:opened', recipientInfo); // mocking sending the email notification
      return db.insert('recipients', recipientInfo)
    })
    .catch( err => sendResponse(res, JSON.stringify({error: 'An error occured'}), 500) );
}

appEmitter.on('event:opened', email => console.log('Email was opened', email) ); // mocking sending the email notification

module.exports = { recipient, tracker };
