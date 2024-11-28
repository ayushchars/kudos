import KudosModel from "../../models/kudosModel.js";
import {
  ErrorResponse,
  successResponse,
  notFoundResponse,
  successResponseWithData,
} from "../../helpers/apiResponse.js";
import userModel from "../../models/userModel.js";

export const sendKudos = async (req, res) => {
    try {
      const { from, to, message,badges } = req.body;
  
      if (!from || !to || !message) {
        return ErrorResponse(res, "All fields (from, to, message) are required");
      }
  
      const fromUser = await userModel.findById(from);
      if (!fromUser) {
        return notFoundResponse(res, `User with ID '${from}' not found`);
      }
  
      const toUser = await userModel.findById(to);
      if (!toUser) {
        return notFoundResponse(res, `User with ID '${to}' not found`);
      }
  
      const kudos = await new KudosModel({
        from: fromUser._id,
        to: toUser._id,
        message,
        badges
      }).save();
  
      return successResponseWithData(res, "Kudos sent successfully", kudos);
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while sending kudos");
    }
  };
  

  export const fetchUserKudos = async (req, res) => {
    try {
      const { userId } = req.body;
      const kudos = await KudosModel.find({to: userId })
        .populate("from", "name email")
        .populate("to", "name email");
  
      if (!kudos || kudos.length === 0) {
        return notFoundResponse(res, "No kudos found for this user");
      }
  
      return successResponseWithData(res, "Kudos fetched successfully", kudos);
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while fetching user kudos");
    }
  };

  export const getKudosAnalytics = async (req, res) => {
    try {
      const totalKudos = await KudosModel.countDocuments();
  
      const badgeAggregation = await KudosModel.aggregate([
        {
          $group: {
            _id: "$badges",
            count: { $sum: 1 },
          },
        },
      ]);
      const badges = badgeAggregation.reduce((acc, badge) => {
        if (badge._id) {
          acc[badge._id] = badge.count;
        }
        return acc;
      }, {});
  
      const receiverAggregation = await KudosModel.aggregate([
        {
          $group: {
            _id: "$to",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $project: {
            name: "$userDetails.name",
            count: 1,
          },
        },
      ]);
  
      const sortedReceivers = receiverAggregation
        .sort((a, b) => b.count - a.count)
        .reduce((acc, receiver) => {
          acc[receiver.name] = receiver.count;
          return acc;
        }, {});
  
  
      return successResponseWithData(res, "Kudos analytics fetched successfully", {
        totalKudos,
        badges,
        receivers: sortedReceivers, 
      });
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while fetching kudos analytics");
    }
  };
  
  export const getKudosFeed = async (req, res) => {
    try {
      const kudosFeed = await KudosModel.find({})
        .populate("from", "name email") 
        .populate("to", "name email");  
  
      const feed = kudosFeed.map((kudo) => ({
        id: kudo._id,
        sender: kudo.from.name, 
        receiver: kudo.to.name,
        badge: kudo.badges,
        message: kudo.message,
        likeCount: kudo.likedby.length,
      }));

      feed.sort((a, b) => b.likeCount - a.likeCount);
      return successResponseWithData(res, "Kudos feed fetched successfully", feed);
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while fetching kudos feed");
    }
  };
  export const likeKudos = async (req, res) => {
    try {
      const { kudoId, userId, like } = req.body;

      if (!kudoId || !userId || typeof like !== 'boolean') {
        return ErrorResponse(res, "kudoId, userId, and like (boolean) are required");
      }
  
      const kudo = await KudosModel.findById(kudoId);
      if (!kudo) {
        return notFoundResponse(res, `Kudo with ID '${kudoId}' not found`);
      }

      if (like) {
        if (!kudo.likedby.includes(userId)) {
          kudo.likedby.push(userId);
          await kudo.save();
        } else {
          return ErrorResponse(res, "You have already liked this kudo");
        }
      } else {
        await KudosModel.updateOne(
          { _id: kudoId },
          { $pull: { likedby: userId } }
        );
      }
  
      return successResponse(res, `Kudo ${like ? "liked" : "unliked"} successfully`);
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while updating the kudo like status");
    }
  };
  
  export const getLikedKudos = async (req, res) => {
    try {
      const { userId } = req.body; 
  
      if (!userId) {
        return ErrorResponse(res, "User ID is required");
      }
      const likedKudos = await KudosModel.find({ likedby: userId })
      .select("-likedby")
        .populate("from", "name email") 
        .populate("to", "name email");
  
      if (!likedKudos || likedKudos.length === 0) {
        return successResponseWithData(res, "No liked kudos found", []);
      }
  
      return successResponseWithData(res, "Liked kudos fetched successfully", likedKudos);
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while fetching liked kudos");
    }
  };