exports.renderProfile = (req, res) => {
  // res.render("profile", { title: "내 정보 - Biblical" });
  res.send({ message: "내 정보 - Biblical" });
};

exports.renderJoin = (req, res) => {
  // res.render("signup", { title: "회원가입 - Biblical" });
  res.send({ message: "회원가입 성공" });
};

exports.renderMain = (req, res, next) => {
  const twits = [];
  res.render("main", {
    title: "Biblical",
    twits,
  });
};
