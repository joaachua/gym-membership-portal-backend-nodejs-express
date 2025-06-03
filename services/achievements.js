const knex = require("../config/knex");

const checkAndUpdateAchievements = async (userId, type) => {
	// Get all achievements for the type
	const achievements = await knex("achievements").where({ type });

	for (const achievement of achievements) {
		const userRecord = await knex("user_achievements")
			.where({ user_id: userId, achievement_id: achievement.id })
			.first();

		let progress = userRecord ? userRecord.progress + 1 : 1;
		let isUnlocked = progress >= achievement.target_value;

		if (!userRecord) {
			await knex("user_achievements").insert({
				user_id: userId,
				achievement_id: achievement.id,
				progress,
				is_unlocked: isUnlocked,
				unlocked_at: isUnlocked ? new Date() : null,
			});
		} else {
			await knex("user_achievements")
				.where({ user_id: userId, achievement_id: achievement.id })
				.update({
					progress,
					is_unlocked: isUnlocked,
					unlocked_at:
						isUnlocked && !userRecord.is_unlocked
							? new Date()
							: userRecord.unlocked_at,
				});
		}
	}
}

module.exports = { checkAndUpdateAchievements };