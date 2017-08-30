const { MongoClient } = require('mongodb');

let db;
const connect = dbUrl => {
  MongoClient.connect(dbUrl, (err, database) => {
    db = database;
    // create indexes for faster lookup in collections
    db.collection('trackers').createIndex( { emailId: 1 } );
    db.collection('recipients').createIndex( { emailId: 1 } );
  });
}

const findEntry = (collectionName, query) => {
  return new Promise( (resolve, reject) => {
    const cursor = db.collection(collectionName).find(query)
    cursor.each((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
}

const insert = (collectionName, doc) => {
  return new Promise( (resolve, reject) => {
    db.collection(collectionName).insertOne(doc, (err, result) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

const remove = (collectionName, query) => {
  return new Promise( (resolve, reject) => {
    db.collection(collectionName).remove(query, (err, result) => {
      if (err) reject(err);
      else resolve();
    })
  });
}

const close = () => {
  db.close();
}

process.on('SIGINT', close);
process.on('SIGTERM', close);

module.exports = { connect, findEntry, insert, remove };
