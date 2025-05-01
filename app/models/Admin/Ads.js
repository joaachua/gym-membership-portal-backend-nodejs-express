const knex = require("../../../config/db");
const { getUrl } = require("../../../services/helper");

const Ads = {
	findAdvertisementById: async (id) => {
		try {
			const advertisement = await knex("advertisements").where({ id }).first();

			if (!advertisement) return null;

			advertisement.image_url = getUrl(advertisement.image, "image");
			return advertisement;
		} catch (error) {
			throw error;
		}
	},

	createAdvertisement: async (data) => {
		const { title, description, image, type, redirect_link, sequence, status } = data;

		if (!title || !description || !type) {
			throw new Error("Title, description, and type are required");
		}

		const insertData = {
			title,
			description,
			type,
			image: image || "",
			redirect_link: redirect_link || "",
			sequence: sequence || "",
			status: status || 0,
		};

		const [id] = await knex("advertisements").insert(insertData);

		if (!id) throw new Error("Failed to create advertisement");

		return { id, ...insertData };
	},

	editAdvertisement: async (id, data) => {
		if (!id) throw new Error("Invalid advertisement ID");

		const { title, description, image, type, redirect_link, sequence, status } = data;
		const updateData = {};

		if (title) updateData.title = title;
		if (description) updateData.description = description;
		if (image) updateData.image = image;
		if (type) updateData.type = type;
		if (redirect_link) updateData.redirect_link = redirect_link;
		if (sequence) updateData.sequence = sequence;
		if (status !== undefined) updateData.status = status;

		const updated = await knex("advertisements").where({ id }).update(updateData);

		return updated > 0; // true if updated, false if not found
	},

	deleteAdvertisementById: async (id) => {
		const deleted = await knex("advertisements").where({ id }).del();
		return deleted > 0; // true if deleted, false if not found
	},

	listAdvertisements: async (data) => {
		const { title, type, status, start_date, end_date, page = 1, perPage = 10 } = data;

		let query = knex("advertisements").select("*").orderBy("created_at", "desc");

		if (title) query.where("title", "like", `%${title}%`);
		if (type) query.where("type", type);
		if (status !== undefined) query.where("status", status);
		if (start_date) query.where("created_at", ">=", start_date);
		if (end_date) query.where("created_at", "<=", end_date);

		// Count total
		const [{ total }] = await knex("advertisements")
			.count("id as total")
			.where((builder) => {
				if (title) builder.where("title", "like", `%${title}%`);
				if (type) builder.where("type", type);
				if (status !== undefined) builder.where("status", status);
				if (start_date) builder.where("created_at", ">=", start_date);
				if (end_date) builder.where("created_at", "<=", end_date);
			});

		const totalPages = Math.ceil(total / perPage);
		const offset = (page - 1) * perPage;

		query.limit(perPage).offset(offset);
		const advertisements = await query;

		const formattedAds = advertisements.map((ad) => ({
			...ad,
			image_url: getUrl(ad.image, "image"),
		}));

		return {
			data: formattedAds,
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

module.exports = Ads;