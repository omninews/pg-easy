# pg-easy

## Usage

```
import pg from 'pg-easy';
import conStr from 'postgres://localhost:5432';

export const db = pg.create({conStr}, {
  getStuff: `select * from stuff
              offset $1
              limit $2;`
});

export const getStuff = (offset, limit) => {
  return db.getStuff(offset, limit).then({rows} => rows);
};
```
