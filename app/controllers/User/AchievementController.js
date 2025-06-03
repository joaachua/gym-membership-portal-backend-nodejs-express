const { body, validationResult } = require("express-validator");
const {
	sendSuccessResponse,
	sendErrorResponse,
} = require("../../../services/helper");
const Achievements = require("../../models/User/Achievements");

exports.userAchievements = [
	async (req, res) => {
		try {
			const user_id = req.user.user_id;
			const data = await Achievements.getUserAchievements(user_id);
			return sendSuccessResponse(res, 200, "User achievements", data);
		} catch (err) {
			console.error(err);
			return sendErrorResponse(res, 500, "Server error");
		}
	},
];
