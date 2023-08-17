const bcrypt = require("bcrypt");
const Meeting = require("../models/meeting");
const User = require("../models/user");

exports.postMeeting = async (req, res, next) => {
  const { name, introduce } = req.body;
  try {
    const meeting = await Meeting.create({
      name,
      introduce,
      hostId: req?.user?.id,
    });
    await meeting.addMembers(parseInt(req?.user.id, 10));
    // console.log("🎁 모임생성 :", meeting);
    return res.status(200).json({
      code: "OK",
      message: "모임이 생성됐습니다.",
      meeting: {
        meetId: meeting?.id,
        name: meeting?.name,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.getMeetings = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req?.user?.id } });
    const meetings = await user.getMembers({
      attributes: ["name"],
    });
    console.log("🌏 유저+ 모임", meetings);
    return res.status(201).json({ meetings });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.getMeeting = async (req, res, next) => {
  try {
    const exMeeting = await Meeting.findOne({
      where: { id: req?.params?.meetId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    console.log("✅ 모임조회 :", exMeeting);
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

/** 모임초대 링크생성 */
exports.postMeetingInviteLink = async (req, res, next) => {
  const { meetId } = req?.params;
  try {
    const inviteId = await bcrypt.hash(meetId, 10);
    let meeting = await Meeting.update(
      { inviteLink: inviteId },
      { where: { id: meetId } }
    );
    console.log("🎁모임 링크 추가 후 :", meeting);
    return res.status(200).json({ inviteLink: inviteId });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.postMeetingInvite = async (req, res, next) => {
  const { inviteToken } = req?.params;
  try {
    return res.status(200).json({ message: "모임초대 생성" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
