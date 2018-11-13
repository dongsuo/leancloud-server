const http = require('https')

'use strict';

const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({ prefix: '/isbnbook' });

// 查询 isbnbook 列表
router.get('/', async function (ctx) {
  await new Promise((resolve, reject) => {
    http.get('https://api.douban.com/v2/book/isbn/' + ctx.query.isbn, async (resp) => {
      let body = ''
      resp.on('data', (chunk) => {
        body += chunk
      })
      resp.on('end', async () => {
        const query = new AV.Query('UserMarkBook')
        query.equalTo('isbn', ctx.query.isbn)
        query.equalTo('user_id', ctx.userInfo.objectId)
        await query.find().then(async (result) => {
          if (result.length !== 0) {
            body = JSON.parse(body)
            body.status = JSON.parse(JSON.stringify(result[0])).status
          }
          resolve(body)

        }, async (error) => {
          console.log(error)
          createMark(ctx, content)
        })
      })
    })
  }).then(body => {
    ctx.body = body
  }).catch(Error => {
    ctx.state.data = Error
  })
});
module.exports = router;