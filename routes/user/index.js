const Router = require("koa-router");
const AV = require("leanengine");

const router = new Router({ prefix: "/user" });

router.post("/signup", async ctx => {
  const { userName, password, email } = ctx.request.body;
  if (!userName || !password || !email) {
    ctx.body = {
      code: 50000,
      message: "注册信息不完整"
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
  try {
    await user.signUp();
    ctx.body = {
      code: 20000,
      message: "注册成功"
    };
  } catch (error) {
    ctx.body = {
      code: 50000,
      message: error
    };
  }
});

router.post("/login", async ctx => {
  const { userName, password } = ctx.request.body;
  if (!userName || !password) {
    ctx.body = {
      code: 50000,
      message: "登录信息不完整"
    };
    return;
  }
  try {
    const user = await AV.User.logIn(userName, password)
    ctx.body = {
      code: 20000,
      data: {
        token: user._sessionToken
      },
      message: "登录成功"
    };
  } catch (error) {
    ctx.body = {
      code: 50000,
      message: error.message
    };
  }
});

module.exports = router;
