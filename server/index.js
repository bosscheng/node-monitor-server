const Koa = require('koa');
const KoaRouter = require('koa-router');
const cors = require('koa2-cors');
const koaBodyParser = require("koa-bodyparser");

const consola = require('consola')
const {Nuxt, Builder} = require('nuxt')

const mongodb = require('./db');
const socket = require('./socket');
const API = require('./api');
const LRUMap = require('./utils/lru').LRUMap;

const app = new Koa();

app.use(cors());

const router = new KoaRouter({prefix: '/api'});


const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000;

app.context.lruCache = new LRUMap(1000);

app.use(koaBodyParser({enableTypes: ['json', 'form', 'text']}));

//
app.use(async (ctx, next) => {
  const nextResult = await next()
  if (nextResult != null && ctx.status != 200)
    ctx.body = nextResult
});
//
app.use(router.routes());
//
app.use(router.allowedMethods());

// 配置 路由信息。
for (const method in API) {
  for (const path in API[method]) {
    let value = API[method][path]
    if (typeof value == 'function') value = [value]
    router[method](path, ...value)
  }
}


// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')

config.dev = !(app.env === 'production')

const nuxt = new Nuxt(config)
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

app.use(ctx => {
  ctx.status = 200
  ctx.respond = false // Bypass Koa's built-in response handling
  ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
  nuxt.render(ctx.req, ctx.res)
});


//
mongodb.connect().then(() => {
  socket(app.listen(port), app.context);
  console.log(`server listening to ${host}:${port}`);
}).catch(() => {
  console.error('gg');
});

