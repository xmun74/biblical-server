const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const indexRouter = require("./routes");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const meetingRouter = require("./routes/meetings");
const postsRouter = require("./routes/posts");
const postRouter = require("./routes/post");
const bibleRouter = require("./routes/bible");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const logger = require("./logger");
const helmet = require("helmet");
const hpp = require("hpp");
dotenv.config();

const app = express();
passportConfig();
const webSocket = require("./socket");
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
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
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
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

const server = app.listen(app.get("port"), () => {
  console.log(
    `🌏 RUN http://localhost:${app.get("port")} | ${app.get("port")} PORT`
  );
});
webSocket(server);
