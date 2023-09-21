import express, { ErrorRequestHandler } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import { sequelize } from "./models";
import passportConfig from "./passport";
import logger from "./logger";
import helmet from "helmet";
import hpp from "hpp";
import redis, { createClient } from "redis";
import RedisStore from "connect-redis";
import webSocket from "./socket";

import indexRouter from "./routes";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import meetingRouter from "./routes/meetings";
import postsRouter from "./routes/posts";
import postRouter from "./routes/post";
import bibleRouter from "./routes/bible";

dotenv.config();
const redisClient = createClient({
  socket: {
    host: `${process.env.REDIS_HOST}`,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PWD,
});
redisClient.connect().catch(console.error);
const app = express();
passportConfig();
app.set("port", process.env.PORT || 8080);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}
app.use("/", express.static(path.resolve(__dirname, "../uploads"))); // 이미지
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  name: "session-cookie",
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET!,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  proxy: false,
  store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === "production") {
  // sessionOption.proxy = true; // https 노드앞에 다른 서버 둘때
  // sessionOption.cookie.secure = true; // https 적용시
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ DB 연결 성공");
  })
  .catch((err) => console.error(err));

/* routes 분기 */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/meetings", meetingRouter);
app.use("/posts", postsRouter);
app.use("/post", postRouter);
app.use("/bible", bibleRouter);

/* Error 처리 */
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  logger.error(error.message);
  next(error);
});
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statue || 500).send(err.message);
};
app.use(errorHandler);

const server = app.listen(app.get("port"), () => {
  console.log(
    `🌏 RUN http://localhost:${app.get("port")} | ${app.get("port")} PORT`
  );
});
webSocket(server);

export default app;
