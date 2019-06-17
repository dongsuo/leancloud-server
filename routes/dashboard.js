const Router = require("koa-router");
const AV = require("leanengine");

const router = new Router({ prefix: "/dashboard" });

const Dashboard = AV.Object.extend("Dashboard");
const DbOrder = AV.Object.extend("DbOrder");

// status: deleted = 0; normal = 1;
router.post("/", async ctx => {
  // 新建对象
  var dashboard = new Dashboard();
  // 设置名称

  dashboard.set("name", ctx.request.body.name);
  dashboard.set("desc", ctx.request.body.desc);
  dashboard.set("content", ctx.request.body.content);
  dashboard.set("creator", ctx.currentUser.id);
  dashboard.set("isPrivate", false);
  dashboard.set("status", 1);
  const db = await dashboard.save()

  var query = new AV.Query('DbOrder');
  query.equalTo('user', ctx.currentUser.id)
  const resp = await query.find()
  const oldOrder = resp[0]

  if(oldOrder) {
    const order = oldOrder.get('order').split('|')
    order.unshift(db.id)
    oldOrder.set('order', order.join('|'))
    orderId = await oldOrder.save()
  } else {
    const order = [db.id]
    const newOrder = new DbOrder()
    newOrder.set('order', order.join('|'))
    newOrder.set('user', ctx.currentUser.id)
    orderId = await newOrder.save()
  }

  ctx.body = {
    code: 20000,
    data: { id: db.id }
  };
});

router.put("/", async ctx => {
  const dbId = ctx.request.body.objectId;
  const dashboard = AV.Object.createWithoutData("Dashboard", dbId);
  dashboard.set("name", ctx.request.body.name);
  dashboard.set("desc", ctx.request.body.desc);
  dashboard.set("content", ctx.request.body.content);
  dashboard.set("isPrivate", false);
  dashboard.set("status", 1);
  const db = await dashboard.save()
  ctx.body = {
    code: 20000,
    data: { id: db.id }
  };
});

router.get("/", async ctx => {
  const dbId = ctx.query.id;
  var query = new AV.Query('Dashboard');
  ctx.body = {
    code: 20000,
    data: await query.get(dbId)
  };
});

router.get("/list", async ctx => {
  const uid = ctx.currentUser.id;
  var query = new AV.Query('Dashboard');
  query.equalTo('creator', uid)
  query.equalTo('status', 1)

  var orderQuery = new AV.Query('DbOrder');
  orderQuery.equalTo('user', uid)
  const [dbs, orders] = await Promise.all([query.find(), orderQuery.find()])

  const order = orders[0].get('order').split('|')
  ctx.body = {
    code: 20000,
    data: {
      dashboards: dbs,
      order
    }
  };
});

router.delete("/", async ctx => {
  const dbId = ctx.request.body.id;
  var dashboard = AV.Object.createWithoutData('Dashboard', dbId);
  dashboard.set("status", 0);
  await dashboard.save()
  var query = new AV.Query('DbOrder');
  query.equalTo('user', ctx.currentUser.id)
  const resp = await query.find()
  const oldOrder = resp[0]

  const order = oldOrder.get('order').split('|')
  order.splice(order.indexOf(dbId),1)
  oldOrder.set('order', order.join('|'))
  orderId = await oldOrder.save()

  ctx.body = {
    code: 20000,
    data: {
      success: true
    }
  };
});

router.post("/order", async ctx => {
  const uid = ctx.currentUser.id;
  const order = ctx.request.body.order
  let orderId
  var query = new AV.Query('DbOrder');
  query.equalTo('user', uid)
  const resp = await query.find()
  const oldOrder = resp[0]

  if(oldOrder) {
    oldOrder.set('order', order.join('|'))
    orderId = await oldOrder.save()
  } else {
    const newOrder = new DbOrder()
    newOrder.set('order', order.join('|'))
    newOrder.set('user', uid)
    orderId = await newOrder.save()
  }
  ctx.body = {
    code: 20000,
    data: {
      id: orderId
    }
  };
})

module.exports = router;
