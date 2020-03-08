const Router = require("koa-router");
const AV = require("leanengine");

const router = new Router({ prefix: "/chartdashmap" });

const ChartDashMap = AV.Object.extend("ChartDashMap");

router.post("/", async ctx => {
  // 新建对象
  var chartDashMap = new ChartDashMap();
  // 设置名称
  const { chart_id, dashboard_id } = ctx.request.body;

  const chartQuery = new AV.Query("Chart");
  const dashboardQuery = new AV.Query("Dashboard");
  const resp = await Promise.all([
    chartQuery.get(chart_id),
    dashboardQuery.get(dashboard_id)
  ]);
  chartDashMap.set("chart", resp[0]);
  chartDashMap.set("dashboard", resp[1]);
  await chartDashMap.save();
  ctx.body = {
    code: 20000,
    data: {
      success: true
    }
  };
});

router.post("/unmap", async ctx => {
  const { chart_id, dashboard_id } = ctx.request.body;
  const query = new AV.Query("ChartDashMap");
  const dashboard = AV.Object.createWithoutData("Dashboard", dashboard_id);
  const chart = AV.Object.createWithoutData("Chart", chart_id);
  // console.log(dashboard, chart)
  query.equalTo("dashboard", dashboard);
  query.equalTo("chart", chart);
  const maps = await query.find();
  await AV.Query.doCloudQuery(
    `delete from ChartDashMap where objectId="${maps[0].get("objectId")}"`
  );
  ctx.body = {
    code: 20000,
    data: {
      success: true
    }
  };
});

router.get("/chartbydashboard", async ctx => {
  const dashboardId = ctx.query.id;
  const dashboard = AV.Object.createWithoutData("Dashboard", dashboardId);
  const query = new AV.Query("ChartDashMap");
  query.equalTo("dashboard", dashboard);
  const maps = await query.find();
  const queryIds = maps.map((map, i, a) => {
    return map.get("chart").id
  });
  const chartQuery = new AV.Query("Chart");
  const charts = chartQuery.containedIn('objectId', queryIds)

  ctx.body = {
    code: 20000,
    data: await charts.find()
  };
});

router.get("/dbbychart", async ctx => {
  const chartId = ctx.query.id;
  const chart = AV.Object.createWithoutData("Chart", chartId);
  const query = new AV.Query("ChartDashMap");
  query.equalTo("chart", chart);
  const maps = await query.find();
  const dbIds = maps.map(map => {
    return map.get("dashboard").id
  })

  ctx.body = {
    code: 20000,
    data: dbIds
  };
});

module.exports = router;
