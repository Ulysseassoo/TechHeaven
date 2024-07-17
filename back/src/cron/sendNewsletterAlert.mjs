import User from "../models/User.mjs";

export const findUsersWithNewsletterPreference = async () => {
  const users = await User.aggregate([
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
      $match: {
        "preferences.alertDetails.type": "NEWSLETTER",
        "preferences.isEnabled": true,
      },
    },
    { $project: { email: 1 } },
  ]);

  return users;
};
