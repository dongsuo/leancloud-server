const Router = require("koa-router");
const AV = require("leanengine");

const router = new Router({ prefix: "/chart" });

const Chart = AV.Object.extend("Chart");

router.post("/", async ctx => {
  // 新建对象
  var chart = new Chart();
  // 设置名称
  console.log(ctx.request.body);
  chart.set("chart_name", ctx.request.body.chart_name);
  chart.set("desc", ctx.request.body.desc);
  chart.set("content", ctx.request.body.content);
  chart.set("creator", ctx.currentUser.id);
  chart.set("isPrivate", false);
  chart.set("status", 1);

  await chart.save().then(
    function(chart) {
      console.log("objectId is " + chart.id);
      ctx.body = {
        code: 20000,
        data: { id: chart.id }
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
  const chartId = ctx.request.body.id;
  const chart = AV.Object.createWithoutData("Chart", chartId);
  chart.set("chart_name", ctx.request.body.chart_name);
  chart.set("desc", ctx.request.body.desc);
  chart.set("content", ctx.request.body.content);
  chart.set("isPrivate", false);
  chart.set("status", 1);

  await chart.save().then(
    function(chart) {
      console.log("objectId is " + chart.id);
      ctx.body = {
        code: 20000,
        data: { id: chart.id }
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
  const chartId = ctx.query.id;
  var query = new AV.Query('Chart');
  await query.get(chartId).then(function (chart) {
    // 成功获得实例
    ctx.body = {
      code: 20000,
      data: chart
    };
  }, function (error) {
    ctx.body = {
      code: 40004,
      message: error
    };
  });
});

router.delete("/", async ctx => {
  const chartId = ctx.request.body.id;
  var chart = AV.Object.createWithoutData('Chart', chartId);
  chart.set("status", 0);
  await chart.save().then(
    function(chart) {
      console.log("objectId is " + chart.id);
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
