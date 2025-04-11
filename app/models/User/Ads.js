const knex = require("../../config/db");
const {
	sendErrorResponse,
	sendSuccessResponse,
	getUrl,
} = require("../../../services/helper");

const Ads = {
	listAdvertisements: async () => {
		try {
			const advertisements = await knex("advertisements").select("*").orderBy("sequence", "asc");

            if (!advertisements || advertisements.length === 0) {
                return sendSuccessResponse("No advertisements found");
            }

            // Convert image filenames to full URLs
            const formattedAds = advertisements.map((ad) => ({
                ...ad,
                image_url: getUrl(ad.image, "image"),
            }));

            return sendSuccessResponse("Advertisements retrieved successfully", formattedAds);
		} catch (error) {
			return sendErrorResponse("Error deleting advertisement", error);
		}
	},
};

module.exports = Ads;