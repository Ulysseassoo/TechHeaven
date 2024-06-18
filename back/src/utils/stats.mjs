import User from "../models/User.mjs";

export const getTotalUsers = async () => {
    const totalUsers = await User.countDocuments({});
    return totalUsers;
}

export const getNewUsersOverTime = async () => {
    const users = await User.aggregate([
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }, count: { $sum: 1 } } },
        { 
            $project: { 
                date: '$_id',
                count: 1,
                _id: 0
            } 
        },
        { $sort: { "date": 1 } }
    ]);
    return users;
}