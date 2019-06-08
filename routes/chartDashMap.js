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
  await Promise.all([
    chartQuery.get(chart_id),
    dashboardQuery.get(dashboard_id)
  ])
    .then(resp => {
      chartDashMap.set("chart", resp[0]);
      chartDashMap.set("dashboard", resp[1]);
      chartDashMap.save();
      ctx.body = {
        code: 20000,
        data: {
          success: true
        }
      };
    })
    .catch(error => {
      console.log(error);
      ctx.body = {
        code: 50000,
        message: error
      };
    });
});

router.post("/unmap", async ctx => {
  const { chart_id, dashboard_id } = ctx.request.body;
  const query = new AV.Query("ChartDashMap");
  const dashboard = AV.Object.createWithoutData("Dashboard", dashboard_id);
  const chart = AV.Object.createWithoutData("Chart", chart_id);
  // console.log(dashboard, chart)
  query.equalTo("dashboard", dashboard);
  query.equalTo("chart", chart);
  await query.find().then(async maps => {
    await AV.Query.doCloudQuery(
      `delete from ChartDashMap where objectId="${maps[0].get("objectId")}"`
    ).then(
      function() {
        // 删除成功
        ctx.body = {
          code: 20000,
          data: {
            success: true
          }
        };
      },
      function(error) {
        // 异常处理
        ctx.body = {
          code: 50000,
          message: error
        };
      }
    );
  });
});

router.get("/chartbydashboard", async ctx => {
  const dashboardId = ctx.query.id;
  const dashboard = AV.Object.createWithoutData("Dashboard", dashboardId);
  const query = new AV.Query("ChartDashMap");
  query.equalTo("dashboard", dashboard);
  await query
    .find()
    .then(async maps => {
      const queryList = maps.map((map, i, a) => {
        const chartQuery = new AV.Query("Chart");
        return chartQuery.get(map.get("chart").id);
      });
      await Promise.all(queryList)
        .then(chartList => {
          ctx.body = {
            code: 20000,
            data: chartList
          };
        })
        .catch(error => {
          ctx.body = {
            code: 50000,
            message: error
          };
        });
    })
    .catch(error => {
      ctx.body = {
        code: 50000,
        message: error
      };
    });
});

module.exports = router;
