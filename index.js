'use strict';

import pg from 'pg';

export default class DB {
  static create (...args) {
    return new DB(...args);
  }

  constructor ({conStr}, queries) {
    this.conStr_ = conStr;

    Object.keys(queries).forEach((name) => {
      if(this[name]) {
        throw new Error(`Query name collision! The name ${name} is not available.`);
      }
      var query = queries[name];
      this[name] = this.preparedQuery_(query);
    });
  }

  preparedQuery_ (query) {
    return (...args) => this.query(query, args);
  }

  query (query, args = []) {
    return new Promise((resolve, reject) => {
      pg.connect(this.conStr_, (err, client, done) => {
        if (err) {
          done();
          return reject(err);
        }

        client.query(query, args, (err2, result) => {
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
