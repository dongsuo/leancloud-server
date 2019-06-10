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

  try {
    const savedChart = await chart.save()
    ctx.body = {
      code: 20000,
      data: { id: savedChart.id }
    };
  } catch (error) {
    ctx.body = {
      code: 50000,
      message: error
    };
  }
});

router.put("/", async ctx => {
  const chartId = ctx.request.body.id;
  const chart = AV.Object.createWithoutData("Chart", chartId);
  chart.set("chart_name", ctx.request.body.chart_name);
  chart.set("desc", ctx.request.body.desc);
  chart.set("content", ctx.request.body.content);
  chart.set("creator", ctx.currentUser.id);
  chart.set("isPrivate", false);
  chart.set("status", 1);
  try {
    const savedChart = await chart.save()
    ctx.body = {
      code: 20000,
      data: { id: savedChart.id }
    };
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 50000,
      message: error
    };
  }
});

router.get("/", async ctx => {
  const chartId = ctx.query.id;
  var query = new AV.Query("Chart");
  try {
    ctx.body = {
      code: 20000,
      data: await query.get(chartId)
    };
  } catch (error) {
    ctx.body = {
      code: 40004,
      message: 'Not Found'
    };
  }
});

router.get("/list", async ctx => {
  const uid = ctx.currentUser.id;
  var query = new AV.Query("Chart");
  query.equalTo("creator", uid);
  query.equalTo("status", 1);
  try {
    const charts = await query.find();
    // 成功获得实例
    ctx.body = {
      code: 20000,
      data: charts
        .map(item => {
          return {
            chart_id: item.get("objectId"),
            creator: item.get("creator"),
            desc: item.get("desc"),
            chart_name: item.get("chart_name"),
            status: item.get("status"),
            isPrivate: item.get("isPrivate")
          };
        })
    };
  } catch (error) {
    ctx.body = {
      code: 40004,
      message: error
    };
  }
});

router.delete("/", async ctx => {
  const chartId = ctx.request.body.id;
  var chart = AV.Object.createWithoutData("Chart", chartId);
  chart.set("status", 0);
  try {
    await chart.save();
    ctx.body = {
      code: 20000,
      data: {
        success: true
      }
    };
  } catch (error) {
    ctx.body = {
      code: 50000,
      message: error
    };
  }
});

module.exports = router;
