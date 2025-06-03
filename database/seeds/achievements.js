/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex("achievements").del();

	// Inserts seed entries
	await knex("achievements").insert([
		{
			title: "First Workout",
			description: "Complete your first workout.",
			icon: "🏋️",
			type: "workout",
			target_value: 1,
		},
		{
			title: "Workout Streak",
			description: "Work out 7 days in a row.",
			icon: "🔥",
			type: "streak",
			target_value: 7,
		},
		{
			title: "10 Workouts",
			description: "Complete 10 workouts total.",
			icon: "💪",
			type: "workout",
			target_value: 10,
		},
		{
			title: "Healthy Eater",
			description: "Log meals for 5 consecutive days.",
			icon: "🥗",
			type: "meal",
			target_value: 5,
		},
		{
			title: "Early Bird",
			description: "Complete a workout before 8AM for 3 days.",
			icon: "🌅",
			type: "time_based",
			target_value: 3,
		},
	]);
};
