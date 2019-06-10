const Router = require("koa-router");
const AV = require("leanengine");

const router = new Router({ prefix: "/dashboard" });

const Dashboard = AV.Object.extend("Dashboard");
// status: deleted = 0; normal = 1;
router.post("/", async ctx => {
  // 新建对象
  var dashboard = new Dashboard();
  // 设置名称
  console.log(ctx.request.body);
  dashboard.set("name", ctx.request.body.name);
  dashboard.set("desc", ctx.request.body.desc);
  dashboard.set("content", ctx.request.body.content);
  dashboard.set("creator", ctx.currentUser.id);
  dashboard.set("isPrivate", false);
  dashboard.set("status", 1);
  const db = await dashboard.save()
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
  const dbs = await query.find()
  ctx.body = {
    code: 20000,
    data: dbs
  };
});

router.delete("/", async ctx => {
  const dbId = ctx.request.body.id;
  var dashboard = AV.Object.createWithoutData('Dashboard', dbId);
  dashboard.set("status", 0);
  await dashboard.save()
  ctx.body = {
    code: 20000,
    data: {
      success: true
    }
  };
});

module.exports = router;
