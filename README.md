# email-tracker

## How to run

1. Make sure you have `MongoDb` installed and running.
2. Install dependencies: `npm install`.
3. Start the app: `npm start`.
4. Run the tests: `npm test`.

## API

There are two REST paths available:

`/recipient` - returns a JSON object: `{ imgElement, emailAddress }`:

 * `imgElement` - HTML `<img>` element linking to the image with the id bound to the email address
 * `emailAddress` - e-mail address to send the email to with the embedded image
 
`/:id/tracker.png ` - the path to the image provided by the `/recipient` REST path

## How it works

1. User makes a request for the Recipient's e-mail address and the image to be embedded inside the message for the Recipient
2. When the Recipient opens his e-mail, a request is sent to the server, therefore informing it about the message opening
3. User is notified when the Recipient opens his e-mail (mocked by logging the information to the console)
4. The server stores information about the Recipient:

 * `emailId` - unique id about to the Recipient's e-mail address, generated whenever the User makes a request at `/recipient` path
 * `timestamp` - timestamp of recievent the request sent when the Recipient opens an e-mail sent to him
 * `ipAddress` - Recipient's IP address
 * `userAgent` - data about the device used to open the e-mail (browser, OS)
 * `orginallySentTo` - e-mail address for which the image and id was generated for
 * `reopened` - boolean value indicating the reopening of the e-mail
 
We can recieve information about the Recipient's device, as well as draw conclusions whether the message was forwarded or not.

## File structure:

 * The server itself: `/app/server.js`
 * Database functions: `/app/controllers/database.js`
 * REST routes: `/app/controllers/routes.js`
 * Functions for `routes.js`: `/app/lib/routesHelpers.js`
 * Test files: `/test`

## Additional thoughts


I decided to use Node's `cluster` module to use all CPUs, so that the server can handle more requests. Additionally, every time a process unexpectedly exits (for example due to some error), it is replaced by a new one. All of this is included in `index.js` file. It could be handled by `pm2` module, but I wanted to do that manually to show that I know how it works.

Also for the server to handle database opertions more efficiently, I added indexes to the MongoDB collections. Thanks to that the server is able to parse up to 10 times more requests for a second (benchmarked using: `ab -c200 -t10 <URL>`). It can be seen in `database.js` file.

For better security, a reverse proxy like NGINX could be set up, as well as TCL/SSL.
