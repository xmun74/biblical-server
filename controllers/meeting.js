const Meeting = require("../models/meeting");

exports.postMeeting = async (req, res, next) => {
  const { title, introduce } = req.body;
  try {
    const meeting = await Meeting.create({ title, introduce });
    return res.status(200).json({
      code: "OK",
      message: "모임이 생성됐습니다.",
      meeting: {
        meetId: meeting?.id,
        title: meeting?.title,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.getMeetings = async (req, res, next) => {
  try {
    const myMeetings = await User.findOne({
      where: { id: req?.users?.id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Meeting,
          attributes: ["id", "title"],
        },
      ],
    });
    return res.status(201).json({ message: "전채 모임 조회", myMeetings });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.getMeeting = async (req, res, next) => {
  try {
    console.log("✅ 요청 파람 :", req?.params);
    const exMeeting = await Meeting.findOne({
      where: { id: req?.params?.meetId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return res.status(200).json({
      meeting: exMeeting,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.deleteMeeting = async (req, res, next) => {
  try {
    await Meeting.destroy({
      where: { id: req?.params?.meetId },
    });
    return res.status(200).send("모임 삭제");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
