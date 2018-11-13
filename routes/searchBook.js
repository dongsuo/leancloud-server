const http = require('https')
const Router = require('koa-router');

const router = new Router({ prefix: '/searchbook' });

router.get('/', async ctx => {
    const query = {
        q: ctx.query.keyword ? encodeURIComponent(ctx.query.keyword) : '',
        start: ctx.query.start ? encodeURIComponent(ctx.query.start) : '',
        count: ctx.query.count ? encodeURIComponent(ctx.query.count) : '',
        tag: ctx.query.tag ? encodeURIComponent(ctx.query.tag) : ''
    }
    const url = `https://api.douban.com/v2/book/search?q=${query.q}&start=${query.start}&count=${query.count}&tag=${query.tag}`
    await new Promise((resolve, reject) => {
        http.get(url, async (resp) => {
            let body = ''
            resp.on('data', (chunk) => {
                body += chunk
            })
            resp.on('end', () => {
                resolve(body)
            })
        })
    }).then(body => {
        ctx.body = body
    }).catch(Error => {
        ctx.body = Error
    })
})
module.exports = router;
