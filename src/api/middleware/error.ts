import { useContext } from '@midwayjs/hooks';
import { Context } from '@midwayjs/koa';
import { error } from '../utils/response';
const errorMiddleware = async (next: any) => {
  await next().catch((err) => {
    console.error(err.message);
    const ctx = useContext<Context>();
    let msg = '服务器错误';
    let code = -1;
    if (ctx.status === 401 || err.message?.includes('Authentication Error')) {
      code = 401;
      msg = '登录信息已失效，请重新登录';
    }
    ctx.status = 200;
    ctx.body = error(msg, code);
  });
};

export default errorMiddleware;
