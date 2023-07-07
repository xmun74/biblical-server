const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
dotenv.config();

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8080);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());
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
app.use("/user", userRouter);
app.use("/auth", authRouter);

/* Error 처리 */
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(`🌏 RUN ${app.get("port")}번 PORT`);
});
