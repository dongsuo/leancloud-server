const AV = require("leanengine");

const whiteList = ["/user/login", "/user/signup"];

module.exports = async function auth(ctx, next) {
  // const currentUser = AV.User.current();
  const sessionToken = ctx.request.header["ds-token"];
  if (whiteList.includes(ctx.path)) {
    await next();
  } else if (sessionToken) {
    try {
      await AV.User.become(sessionToken).then(function(user) {
        ctx.currentUser = user;
        // console.log(ctx.currentUser.id)
      });
    } catch (error) {
      console.log(error)
      ctx.body = {
        code: 40003,
        message: "登录失败"
      };
    }
    await next();
  } else {
    ctx.body = {
      code: 40003,
      message: "未登录"
    };
  }
};
