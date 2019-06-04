const Router = require("koa-router");
const mysql = require("mysql");

const router = new Router({ prefix: "/exesql" });

function wrapPromise(connection, sql) {
  return new Promise((res, rej) => {
    connection.query(sql, function(error, results, fields) {
      if (error) {
        rej(error);
      }
      res(results);
    });
  });
}

router.get("/", async ctx => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE
  });
  connection.connect();

  console.log("建立连接");
  // get value from apigw
  console.log(ctx.query);
  const querySql = ctx.query.sql;
  let queryResult;
  let code
  if (!querySql) {
    ctx.body = {
      code: 50000,
      message: "参数错误"
    };
  } else {
    try {
      queryResult = await wrapPromise(connection, querySql);
      code = 20000
    } catch (error) {
      code = 50000
      queryResult = error;
    }
    console.log("数据获取");
  }
  connection.end();
  ctx.body = {
    code: 20000,
    data: queryResult
  };
});

module.exports = router;
