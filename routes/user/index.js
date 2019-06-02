const http = require("https");
const Router = require("koa-router");
const AV = require("leanengine");

const router = new Router({ prefix: "/user" });

router.post("/signup", async ctx => {
  console.log(ctx.request.body);
  const { userName, password, email } = ctx.request.body;
  if (!userName || !password || !email) {
    ctx.body = {
        code: 50000,
        message: '注册信息不完整'
    };
  }
  // 新建 AVUser 对象实例
  var user = new AV.User();
  // 设置用户名
  user.setUsername(userName);
  // 设置密码
  user.setPassword(password);
  // 设置邮箱
  user.setEmail(email);
  await user.signUp().then(loggedInUser => {
      ctx.body = {
        code: 20000,
        message: '注册成功'
      };
    }, error => {
      console.log(error.message)
      ctx.body = {
        code: 50000,
        message: error.message
      };
    }
  );
});

router.post("/login", async ctx => {
  // console.log(ctx.request.body);
  const { userName, password } = ctx.request.body;

  if (!userName || !password) {
    ctx.body = {
        code: 50000,
        message: '登录信息不完整'
    };
  }
  await AV.User.logIn(userName, password).then(loggedInUser => {
    console.log(loggedInUser._sessionToken)
    ctx.body = {
      code: 20000,
      data: {
        token: loggedInUser._sessionToken
      },
      message: '登录成功'
    };
  }, error => {
    console.log('error',error.message)
      ctx.body = {
        code: 50000,
        message: error.message
      }
  })
});

module.exports = router;
