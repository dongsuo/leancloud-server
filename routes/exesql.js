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
  if (!ctx.query.sql) {
    ctx.body = {
      code: 40002,
      message: "参数错误"
    };
    return;
  }
  const querySql = ctx.query.sql.toLowerCase();
  if (
    querySql.indexOf("drop") >= 0 ||
    querySql.indexOf("delete") >= 0 ||
    querySql.indexOf("insert") >= 0 ||
    querySql.indexOf("truncate") >= 0 ||
    querySql.indexOf("update") >= 0 ||
    querySql.indexOf("alter") >= 0 ||
    querySql.indexOf("shutdown") >= 0
  ) {
    ctx.body = {
      code: 40003,
      message: "STOP!!!"
    };
    return;
  }
  let queryResult;
  let code;
  try {
    queryResult = await wrapPromise(connection, querySql);
    code = 20000;
  } catch (error) {
    code = 50000;
    queryResult = error;
  }
  console.log("数据获取");
  connection.end();
  ctx.body = {
    code: 20000,
    data: queryResult
  };
});

module.exports = router;
