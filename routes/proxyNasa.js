const http = require('https')
const Router = require('koa-router');

const router = new Router({ prefix: '/proxy' });

router.get('/', async ctx => {
    const requestUrl = ctx.query.url
    let query = ''
    Object.keys(ctx.query).filter(key => {
        return key !== 'url'
    }).map(key => {
        query+=`&${key}=${ctx.query[key]}`
    })
    const url = `${requestUrl}?${query}`
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
