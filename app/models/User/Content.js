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
	}
};

module.exports = Contents;