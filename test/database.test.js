const expect = require('chai').expect;

const db = require('../app/controllers/database');

describe('database', () => {
  before(() => {
    db.connect('mongodb://localhost:27017/testing');
  });
  after(() => {
    db.remove('test', {});
  });

  describe('insert', () => {
    it('resolves the Promise after the insertion', (done) => {
      db.insert('test', {value: 1}).then( () => done() );
    });
  });
  describe('findEntry', () => {
    it('resolves with the searched element', (done) => {
      const element = {value: 1};
      db.insert('test', element)
        .then( () => db.findEntry('test', element))
        .then( entry => {
          try {
            expect(entry).to.have.property('value')
            done();
          }
          catch(e) {
            done(e);
          }
        });
    });
    it('resolves with undefined', (done) => {
      db.findEntry('test', {value: 500})
        .then( entry => {
          try {
            expect(entry).to.be.a('null');
            done();
          }
          catch(e) {
            done(e);
          }
        });
    });
  });
});
