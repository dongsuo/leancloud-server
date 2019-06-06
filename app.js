'use strict';

const path = require('path');

const AV = require('leanengine');
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');

const auth = require('./middleware/auth')
// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

const app = new Koa();

// 设置模版引擎
app.use(views(path.join(__dirname, 'views')));

// 设置静态资源目录
app.use(statics(path.join(__dirname, 'public')));

const allowCrossDomain = async function(ctx, next) {
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,Access-Control-Allow-Origin,x-avoscloud-application-id,x-avoscloud-application-key, ds-token');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  if ('OPTIONS' === ctx.method) {
    ctx.body = {}
    ctx.status = 200
  } else {
    await next();
  }
};
app.use(allowCrossDomain);

const router = new Router();
app.use(router.routes());

// 加载云引擎中间件
app.use(AV.koa());

app.use(auth)

app.use(bodyParser());

router.get('/', async function(ctx) {

  ctx.state.currentTime = new Date();
  await ctx.render('./index.ejs');
});

// 可以将一类的路由单独保存在一个文件中
app.use(require('./routes/sol').routes());
app.use(require('./routes/user').routes());
app.use(require('./routes/proxyNasa').routes());
app.use(require('./routes/exesql').routes());
app.use(require('./routes/chart').routes());
app.use(require('./routes/dashboard').routes());
app.use(require('./routes/chartDashMap').routes());




module.exports = app;
