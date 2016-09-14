'use strict';

const pg = require('pg');

class DB {
  static create (arg1, arg2, arg3) {
    return new DB(arg1, arg2, arg3);
  }

  constructor (args, queries, useSpread) {
    this.conStr_ = args.conStr;

    Object.keys(queries).forEach((name) => {
      if(this[name]) {
        throw new Error(`Query name collision! The name ${name} is not available.`);
      }
      var query = queries[name];

      if(useSpread) {
        this[name] = this.preparedQuerySpread_(query);
      } else {
        this[name] = this.preparedQuery_(query);
      }
    });
  }

  preparedQuery_ (query) {
    return (args) => this.query(query, args);
  }

  preparedQuerySpread_ (query) {
    const self = this;
    return function () {
      const args = Array.prototype.slice.call(arguments);
      return self.query(query, args);
    };
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
            reject(err2);
          } else {
            resolve(result);
          }
        });
      });
    });
  }
}

module.exports = DB;
