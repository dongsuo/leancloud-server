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
  await dashboard.save().then(
    function(dashboard) {
      console.log("objectId is " + dashboard.id);
      ctx.body = {
        code: 20000,
        data: { id: dashboard.id }
      };
    },
    function(error) {
      ctx.body = {
        code: 50000,
        message: error
      };
      console.error(error);
    }
  );
});

router.put("/", async ctx => {
  const dbId = ctx.request.body.objectId;
  const dashboard = AV.Object.createWithoutData("Dashboard", dbId);
  dashboard.set("name", ctx.request.body.name);
  dashboard.set("desc", ctx.request.body.desc);
  dashboard.set("content", ctx.request.body.content);
  dashboard.set("isPrivate", false);
  dashboard.set("status", 1);

  await dashboard.save().then(
    function(dashboard) {
      console.log("objectId is " + dashboard.id);
      ctx.body = {
        code: 20000,
        data: { id: dashboard.id }
      };
    },
    function(error) {
      ctx.body = {
        code: 50000,
        message: error
      };
      console.error(error);
    }
  );
});

router.get("/", async ctx => {
  const dbId = ctx.query.id;
  var query = new AV.Query('Dashboard');
  await query.get(dbId).then(function (dashboard) {
    // 成功获得实例
    ctx.body = {
      code: 20000,
      data: dashboard
    };
  }, function (error) {
    ctx.body = {
      code: 40004,
      message: error
    };
  });
});

router.get("/list", async ctx => {
  const uid = ctx.currentUser.id;
  var query = new AV.Query('Dashboard');
  query.equalTo('creator', uid)
  await query.find().then(function (dashboard) {
    // 成功获得实例
    console.log(dashboard)
    ctx.body = {
      code: 20000,
      data: dashboard
    };
  }, function (error) {
    ctx.body = {
      code: 40004,
      message: error
    };
  });
});

router.delete("/", async ctx => {
  const dbId = ctx.request.body.id;
  var dashboard = AV.Object.createWithoutData('Dashboard', dbId);
  dashboard.set("status", 0);
  await dashboard.save().then(
    function(dashboard) {
      console.log("objectId is " + dashboard.id);
      ctx.body = {
        code: 20000,
        data: {
          success: true
         }
      };
    },
    function(error) {
      ctx.body = {
        code: 50000,
        message: error
      };
      console.error(error);
    }
  );
});

module.exports = router;
