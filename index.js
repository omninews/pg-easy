'use strict';

const pg = require('pg');

class DB {
  static create (arg1, arg2, arg3) {
    return new DB(arg1, arg2, arg3);
  }

  constructor (args, queries) {
    this.conStr_ = args.conStr;

    Object.keys(queries).forEach((name) => {
      if(this[name]) {
        throw new Error(`Query name collision! The name ${name} is not available.`);
      }
      var query = queries[name];
      this[name] = this.preparedQuery_(query);
    });
  }

  preparedQuery_ (query) {
    return (args, theresMore) => {
      if(theresMore) {
        // Support both using .query(arg1, arg2) and .query([arg1, arg2]) for node < 4 compatibility
        args = Array.prototype.slice.call(arguments);
      }
      return this.query(query, args);
    }
  }

  query (query, args) {
    return new Promise((resolve, reject) => {
      pg.connect(this.conStr_, (err, client, done) => {
        if (err) {
          done();
          return reject(err);
        }

        client.query(query, args || [], (err2, result) => {
          done();

          if (err2) {
            return reject(err2);
          }

          resolve(result);
        });
      });
    });
  }
}

module.exports = DB;
