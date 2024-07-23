import Order from "../models/Order.mjs";
import User from "../models/User.mjs";

export const getTotalUsers = async () => {
  const totalUsers = await User.countDocuments({});
  return totalUsers;
};

export const getNewUsersOverTime = async () => {
  const users = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $sort: { date: 1 } },
  ]);
  return users;
};

export const getTotalRevenuePerDate = async () => {
  const totalRevenue = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $sort: { date: 1 } },
  ]);
  return totalRevenue;
};

export const getTotalRevenue = async () => {
  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, count: { $sum: "$total_amount" } } },
  ]);
  return totalRevenue.length > 0 ? totalRevenue[0].count : 0;
};

export const getCountUsersByNotificationType = async () => {
  const usersByNotificationType = await User.aggregate([
    { $unwind: "$preferences" },
    {
      $lookup: {
        from: "alerts",
        localField: "preferences.alert",
        foreignField: "_id",
        as: "preferences.alertDetails",
      },
    },
    { $unwind: "$preferences.alertDetails" },
    {
      $group: {
        _id: "$preferences.alertDetails.type",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id",
        count: 1,
      },
    },
  ]);

  return usersByNotificationType;
};
