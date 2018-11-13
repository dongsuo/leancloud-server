const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({ prefix: '/addbook' });

router.post('/', async (ctx) => {
    const content = ctx.request.body
    const query = new AV.Query('UserMarkBook')
    query.equalTo('isbn', content.isbn)
    query.equalTo('user_id', ctx.userInfo.objectId)
    await query.find().then(async (result) => {
        if (result.length === 0) {
            await createMark(ctx, content)
        } else {
            ctx.body = {
                code: 20000,
                message: 'success'
            }
            const object = JSON.parse(JSON.stringify(result[0]))
            const savedMark = AV.Object.createWithoutData('UserMarkBook', object.objectId)
            savedMark.set('book_name', content.book_name)
            if (object.status.includes(content.status)) {
                object.status.splice(object.status.indexOf(content.status), 1)
                savedMark.set('status', object.status)
                await savedMark.save()
                ctx.body = {
                    code: 20000,
                    message: 'removed'
                }
            } else {
                object.status.push(content.status)
                savedMark.set('status', object.status)
                await savedMark.save()
                ctx.body = {
                    code: 20000,
                    message: 'success'
                }
            }
        }

    }, async (error) => {
        console.log(error)
        await createMark(ctx, content)
    })
})

async function createMark(ctx, content) {
    const UserMarkBook = AV.Object.extend('UserMarkBook');
    var newMark = new UserMarkBook()
    newMark.set('isbn', content.isbn)
    newMark.set('book_name', content.book_name)
    newMark.set('image', content.image)
    newMark.set('status', [content.status])
    newMark.set('user_id', ctx.userInfo.objectId)
    await newMark.save()
    ctx.body = {
        code: 20000,
        message: 'success'
    }
}

module.exports = router