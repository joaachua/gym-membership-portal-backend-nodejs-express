const knex = require("../../../config/db");

const Achievements = {
	getUserAchievements: async (user_id) => {
		return await knex("user_achievements")
			.join(
				"achievements",
				"user_achievements.achievement_id",
				"achievements.id"
			)
			.where("user_achievements.user_id", user_id)
			.select(
				"achievements.id",
				"achievements.title",
				"achievements.description",
				"achievements.icon",
				"achievements.type",
				"achievements.target_value",
				"user_achievements.progress",
				"user_achievements.is_unlocked",
				"user_achievements.unlocked_at"
			);
	},
};

module.exports = Achievements;