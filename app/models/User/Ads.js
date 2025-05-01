const knex = require("../../../config/db");
const {
	getUrl,
} = require("../../../services/helper");

const Ads = {
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