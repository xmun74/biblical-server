exports.renderProfile = (req, res) => {
  res.send({ message: "내 정보 - Biblical" });
};

exports.renderJoin = (req, res) => {
  res.send({ message: "회원가입 성공" });
};

exports.renderMain = (req, res, next) => {
  res.send("메인페이지");
};
