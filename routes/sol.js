const CONFIG = require('dotenv').config()

const http = require('https')
const Router = require('koa-router');
const mysql = require('mysql')

const router = new Router({ prefix: '/sol' });

function wrapPromise(connection, sql) {
    return new Promise((res, rej) => {
        connection.query(sql, function (error, results, fields) {
            if (error) {
                rej(error)
            }
            res(results)
        })
    })
}

router.get('/', async ctx => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_BASE
    });

    connection.connect();

    console.log('建立连接')
    // get value from apigw
    const { page = 1, limit = 20 } = ctx.query
    const offset = (page - 1) * limit
    const querySql = `SELECT * from insight_sol order by sol desc LIMIT ${limit} OFFSET ${offset}`

    let queryResult = await wrapPromise(connection, querySql)
    // console.log('数据获取', queryResult)
    connection.end();
    ctx.body = queryResult
})
module.exports = router;
