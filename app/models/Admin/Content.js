const knex = require("../../../config/db");

const Contents = {
	findContentById: async (id) => {
		try {
			const content = await knex("contents").where({ id }).first();

			if (!content) return null;

			return content;
		} catch (error) {
			throw error;
		}
	},

	createContent: async (data) => {
		const { title, description, status } = data;

		if (!title || !description) {
			throw new Error("Title and description are required");
		}

		const insertData = {
			title,
			description,
			status: status || 0,
		};

		const [id] = await knex("contents").insert(insertData);

		if (!id) throw new Error("Failed to create content");

		return { id, ...insertData };
	},

	editContent: async (id, data) => {
		if (!id) throw new Error("Invalid content ID");

		const { title, description, status } = data;
		const updateData = {};

		if (title) updateData.title = title;
		if (description) updateData.description = description;
		if (status !== undefined) updateData.status = status;

		const updated = await knex("contents").where({ id }).update(updateData);

		return updated > 0; // true if updated, false if not found
	},

	deleteContentById: async (id) => {
		const deleted = await knex("contents").where({ id }).del();
		return deleted > 0; // true if deleted, false if not found
	},

	listContents: async (data) => {
		const { title, type, status, start_date, end_date, page = 1, perPage = 10 } = data;

		let query = knex("contents").select("*").orderBy("created_at", "desc");

		if (title) query.where("title", "like", `%${title}%`);
		if (status !== undefined) query.where("status", status);
		if (start_date) query.where("created_at", ">=", start_date);
		if (end_date) query.where("created_at", "<=", end_date);

		// Count total
		const [{ total }] = await knex("contents")
			.count("id as total")
			.where((builder) => {
				if (title) builder.where("title", "like", `%${title}%`);
				if (status !== undefined) builder.where("status", status);
				if (start_date) builder.where("created_at", ">=", start_date);
				if (end_date) builder.where("created_at", "<=", end_date);
			});

		const totalPages = Math.ceil(total / perPage);
		const offset = (page - 1) * perPage;

		query.limit(perPage).offset(offset);
		const contents = await query;

		return {
			data: contents,
			pagination: {
				currentPage: page,
				perPage,
				totalRecords: total,
				totalPages,
				hasNextPage: page < totalPages,
				nextPage: page < totalPages ? page + 1 : null,
			},
		};
	},
};

module.exports = Contents;