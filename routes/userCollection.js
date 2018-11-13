const http = require('https')

'use strict';

const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({ prefix: '/usercollection' });

// 查询 isbnbook 列表
router.get('/', async function (ctx) {
    let body
    const query = new AV.Query('UserMarkBook')
    query.equalTo('user_id', ctx.userInfo.objectId)
    await query.find().then(async (result) => {
        body = result
        ctx.body = body
    }, async (error) => {
      console.log(error)
      createMark(ctx, content)
    })
});
module.exports = router;