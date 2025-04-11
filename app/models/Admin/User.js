const knex = require("../../../config/db");

const User = {
	findUserById: async (id) => {
		return knex("users").where({ id }).first();
	},

	findUserByEmail: async (email) => {
		return knex("users").where({ email }).first();
	},

	findUserByUsername: async (username) => {
		return knex("users").where({ username }).first();
	},

	updateUser: async (id, updatedUser) => {
		return knex("users").where({ id }).update(updatedUser);
	},

	deleteUser: async (id) => {
		return knex("users").where({ id }).del();
	},

	listUsers: async (filters = {}, page = 1, perPage = 10) => {
		const query = knex("users");

		// Apply filters
		if (filters.username) {
			query.where("username", "like", `%${filters.username}%`);
		}

		if (filters.email) {
			query.where("email", filters.email);
		}

		if (filters.phone_number) {
			query.where("phone_number", filters.phone_number);
		}

		if (filters.start_date) {
			query.where("created_at", ">=", filters.start_date);
		}

		if (filters.end_date) {
			query.where("created_at", "<=", filters.end_date);
		}

		// Pagination logic
		const offset = (page - 1) * perPage;

		// Get total count of users for pagination
		const totalEntries = await query.clone().count({ count: "*" }).first();
		const totalItems = parseInt(totalEntries.count, 10); // Convert count to integer

		// Calculate total pages
		const totalPages = Math.ceil(totalItems / perPage);

		// Fetch paginated users
		const users = await query
			.limit(perPage)
			.offset(offset)
			.orderBy("created_at", "desc");

		// Calculate pagination data
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;
		const nextPage = hasNextPage ? page + 1 : null;
		const previousPage = hasPreviousPage ? page - 1 : null;

		// Return paginated data with additional info
		return {
			currentPage: page,
			totalPages,
			totalItems,
			nextPage,
			previousPage,
			hasNextPage,
			hasPreviousPage,
			data: users,
		};
	},
};

module.exports = User;
