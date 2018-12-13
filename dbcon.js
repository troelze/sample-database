var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_oelzej',
  password        : '6530',
  database        : 'cs340_oelzej'
});

module.exports.pool = pool;
