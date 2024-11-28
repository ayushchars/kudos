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
      const totalKudosSent = await KudosModel.countDocuments();
      const topUsers = await KudosModel.aggregate([
        {
          $group: {
            _id: "$to",
            kudosReceived: { $sum: 1 },
          },
        },
        { $sort: { kudosReceived: -1 } },
        { $limit: 5 },
      ]).exec();
      
      const topUsersWithDetails = await userModel.find({
        _id: { $in: topUsers.map((user) => user._id) },
      }).select("name email");
      
      return successResponseWithData(res, "Kudos analytics fetched successfully", {
        totalKudosSent,
        topUsers: topUsersWithDetails,
      });
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while fetching kudos analytics");
    }
  };
  
  export const getKudosTrends = async (req, res) => {
    try {
      const trends = await KudosModel.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } }, 
      ]);
  
      return successResponseWithData(res, "Kudos trends fetched successfully", {
        trends,
      });
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while fetching kudos trends");
    }
  };
  
  export const getKudosAnalyticsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return ErrorResponse(res, "User ID is required");
      }
  
      const user = await userModel.findById(userId);
      if (!user) {
        return notFoundResponse(res, `User with ID '${userId}' not found`);
      }
  
      const totalKudosSent = await KudosModel.countDocuments({ from: userId });
      const totalKudosReceived = await KudosModel.countDocuments({ to: userId });
  
      const receivedKudos = await KudosModel.find({ to: userId });
  
      const badgeCount = receivedKudos.reduce((acc, kudos) => {
        if (kudos.badges) {
          if (acc[kudos.badges]) {
            acc[kudos.badges]++;
          } else {
            acc[kudos.badges] = 1;
          }
        }
        return acc;
      }, {});
  
      const senders = {};
      for (const kudos of receivedKudos) {
        const sender = await userModel.findById(kudos.from);
        if (sender) {
          const senderName = sender.name;
          if (senders[senderName]) {
            senders[senderName]++;
          } else {
            senders[senderName] = 1;
          }
        }
      }
  
      return successResponseWithData(res, "User-specific kudos analytics fetched successfully", {
        totalKudosSent,
        totalKudosReceived,
        badges: badgeCount,
        senders,
      });
    } catch (err) {
      console.error(err);
      return ErrorResponse(res, "Error while fetching user-specific kudos analytics");
    }
  };
  