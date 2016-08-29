# pg-easy

## Usage

```
const pg = require('pg-easy');
const conStr = 'postgres://localhost:5432';

exports.db = pg.create({conStr: conStr}, {
  getStuff: `select * from stuff
              offset $1
              limit $2;`
});

exports.getStuff = (offset, limit) => {
  return db.getStuff(offset, limit).then(result => result.rows);
};
```
