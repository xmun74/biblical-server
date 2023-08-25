const bcrypt = require("bcrypt");
const Meeting = require("../models/meeting");
const User = require("../models/user");
const Post = require("../models/post");

exports.postMeeting = async (req, res, next) => {
  const { name, introduce } = req.body;
  try {
    const meeting = await Meeting.create({
      name,
      introduce,
      hostId: req?.user?.id,
    });
    await meeting.addMembers(parseInt(req?.user.id, 10));
    return res.status(200).json({
      code: "SUCC",
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
    return res.status(200).json({
      meeting: exMeeting,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
/** 모임 삭제 - 모임장 권한 */
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
/** 모임 탈퇴 */
exports.deleteWithdraw = async (req, res, next) => {
  const { meetId } = req?.params;
  try {
    const exMeeting = await Meeting.findOne({
      where: { id: meetId },
      attributes: ["id"],
      include: [
        {
          model: User,
          as: "Members",
          where: { id: req?.user?.id }, // 가입 여부
          attributes: ["id"],
        },
      ],
    });
    if (exMeeting) {
      exMeeting.removeMembers(parseInt(req?.user.id, 10));
      return res.status(200).json({ code: "SUCC", message: "모임 탈퇴 성공" });
    } else {
      return res
        .status(400)
        .json({ code: "FAIL", message: "가입하지 않은 모임입니다." });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

/** 모임초대 링크생성 */
exports.postMeetingInviteLink = async (req, res, next) => {
  const { meetId } = req?.params;
  try {
    const exMeeting = await Meeting.findOne({ where: { id: meetId } });
    if (exMeeting?.inviteLink) {
      return res.status(200).json({ inviteLink: exMeeting?.inviteLink });
    } else {
      const hashedId = await bcrypt.hash(meetId, 10);
      const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
      let inviteId = hashedId.replace(reg, "");
      await Meeting.update({ inviteLink: inviteId }, { where: { id: meetId } });
      return res.status(200).json({ inviteLink: inviteId });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.getMeetingInviteInfo = async (req, res, next) => {
  const { meetId, inviteLink } = req?.params;
  try {
    const exMeeting = await Meeting.findOne({ where: { id: meetId } });
    const isInviteMatch = inviteLink === exMeeting?.inviteLink;
    if (isInviteMatch) {
      return res.status(200).json({ meeting: { name: exMeeting.name } });
    } else {
      return res.status(400).json({ message: "유효하지 않은 링크입니다." });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.postMeetingInvite = async (req, res, next) => {
  const { meetId, inviteLink } = req?.params;
  try {
    const exMeeting = await Meeting.findOne({ where: { id: meetId } });
    const isInviteMatch = inviteLink === exMeeting?.inviteLink;
    if (isInviteMatch) {
      exMeeting.addMembers(parseInt(req?.user.id, 10));
      return res.status(200).json({ message: "모임초대 완료" });
    } else {
      return res.status(400).json({ message: "유효하지 않은 링크입니다." });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
exports.getMembers = async (req, res, next) => {
  const { meetId } = req?.params;
  try {
    const meetMembers = await Meeting.findOne({
      where: { id: meetId },
      attributes: ["id"],
      include: [
        {
          model: User,
          as: "Members",
          attributes: ["id", "img", "nickname"],
        },
      ],
    });
    return res.status(200).json(meetMembers);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
