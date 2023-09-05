import bcrypt from "bcrypt";
import Meeting from "../models/meeting";
import User from "../models/user";
import { RequestHandler } from "express";

const postMeeting: RequestHandler = async (req, res, next) => {
  const { name, introduce } = req.body;
  try {
    if (req?.user) {
      const meeting = await Meeting.create({
        name,
        introduce,
        hostId: req?.user?.id,
      });
      await meeting.addMember(req?.user?.id);
      return res.status(200).json({
        code: "SUCC",
        message: "모임이 생성됐습니다.",
        meeting: {
          meetId: meeting?.id,
          name: meeting?.name,
        },
      });
    } else {
      return res.status(401).json({
        code: 401,
        message: "로그인을 해주세요.",
      });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
const getMeetings: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req?.user?.id } });
    const meetings = await user?.getMember({
      attributes: ["name"],
    });
    return res.status(201).json({ meetings });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
const getMeeting: RequestHandler = async (req, res, next) => {
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
const deleteMeeting: RequestHandler = async (req, res, next) => {
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
const deleteWithdraw: RequestHandler = async (req, res, next) => {
  const { meetId } = req?.params;
  try {
    const exMeeting = await Meeting.findOne({
      where: { id: meetId },
      attributes: ["id"],
      include: [
        {
          model: User,
          as: "Member",
          where: { id: req?.user?.id }, // 가입 여부
          attributes: ["id"],
        },
      ],
    });
    if (exMeeting) {
      exMeeting.removeMember(req?.user?.id);
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
const postMeetingInviteLink: RequestHandler = async (req, res, next) => {
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
const getMeetingInviteInfo: RequestHandler = async (req, res, next) => {
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
const postMeetingInvite: RequestHandler = async (req, res, next) => {
  const { meetId, inviteLink } = req?.params;
  try {
    const exMeeting = await Meeting.findOne({ where: { id: meetId } });
    const isInviteMatch = inviteLink === exMeeting?.inviteLink;
    if (isInviteMatch && req?.user) {
      exMeeting.addMember(req?.user?.id);
      return res.status(200).json({ message: "모임초대 완료" });
    } else {
      return res.status(400).json({ message: "유효하지 않은 링크입니다." });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
const getMembers: RequestHandler = async (req, res, next) => {
  const { meetId } = req?.params;
  try {
    const meetMembers = await Meeting.findOne({
      where: { id: meetId },
      attributes: ["id"],
      include: [
        {
          model: User,
          as: "Member",
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
export default {
  postMeeting,
  getMeetings,
  getMeeting,
  deleteMeeting,
  deleteWithdraw,
  postMeetingInviteLink,
  getMeetingInviteInfo,
  postMeetingInvite,
  getMembers,
};
