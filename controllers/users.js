const User = require("../models/user");

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  console.log("결과 :", Number(id) === req?.user?.id);

  try {
    if ((Number(id) === req?.user?.id) === false) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const user = await User.findByPk(id);
    return res
      .status(200)
      .json({ userId: user?.id, email: user?.email, nickname: user?.nickname });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  try {
    if ((Number(id) === req?.user?.id) === false) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    await User.update(
      { nickname: body.nickname },
      { where: { id: req.user.id } }
    );
    return res.status(200).json({ nickname: body.nickname });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.destroy({
      where: { id: req?.user?.id },
    });
    res.clearCookie("connect.sid");
    res.clearCookie("session-cookie");
    await req.session.destroy((err) => {
      if (err) {
        return res.status(400).send("로그인하지 않았습니다.");
      }
    });
    return res.status(200).send("회원탈퇴 처리 완료");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
