const knex = require("../../config/db");
const {
	sendErrorResponse,
	sendSuccessResponse,
    getUrl
} = require("../../../services/helper");

const Ads = {
	findAdvertisementById: async (id) => {
		try {
            const advertisement = await knex("advertisements").where({ id }).first();

            if (!advertisement) {
                return sendErrorResponse("Advertisement not found");
            }

            // Convert image & document filenames to full URLs
            advertisement.image_url = getUrl(advertisement.image, "image");

            return sendSuccessResponse("Advertisement retrieved successfully", advertisement);
		} catch (error) {
			return sendErrorResponse("Error retrieving advertisement", error);
		}
	},

	createAdvertisement: async (data) => {
        try {
            const { title, description, image, type, redirect_link, sequence, status } = data;
    
            if (!title || !description || !type) {
                return sendErrorResponse("Title, description, and type are required");
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
    
            if (!id) {
                return sendErrorResponse("Failed to create advertisement");
            }
    
            return sendSuccessResponse("Advertisement created successfully", { id, ...insertData });
        } catch (error) {
            return sendErrorResponse("Error creating advertisement", error.message);
        }
    },    

	editAdvertisement: async (id, data) => {
        try {
            if (!id) {
                return sendErrorResponse("Invalid advertisement ID");
            }
    
            const { title, description, image, type, redirect_link, sequence, status } = data;
            const updateData = {};
    
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (image) updateData.image = image;
            if (type) updateData.type = type;
            if (redirect_link) updateData.redirect_link = redirect_link;
            if (sequence) updateData.sequence = sequence;
            if (status) updateData.status = status;
    
            const updated = await knex("advertisements").where({ id }).update(updateData);
    
            if (updated > 0) {
                return sendSuccessResponse("Advertisement updated successfully");
            }
            return sendErrorResponse("Advertisement not found or no changes made");
        } catch (error) {
            return sendErrorResponse("Error updating advertisement", error.message);
        }
    },    

	deleteAdvertisementById: async (id) => {
		try {
			const deleted = await knex("advertisements").where({ id }).del();
			if (deleted) {
				return sendSuccessResponse("Advertisement deleted successfully");
			}
			return sendErrorResponse("Advertisement not found or already deleted");
		} catch (error) {
			return sendErrorResponse("Error deleting advertisement", error);
		}
	},

	listAdvertisements: async (data) => {
        try {
            const { title, type, status, start_date, end_date, page = 1, perPage = 10 } = data;
            
            let query = knex("advertisements").select("*").orderBy("created_at", "desc");
    
            // Apply filters if provided
            if (title) query.where("title", "like", `%${title}%`);
            if (type) query.where("type", type);
            if (status) query.where("status", status);
            if (start_date) query.where("created_at", ">=", start_date);
            if (end_date) query.where("created_at", "<=", end_date);
    
            // Get total count before applying pagination
            const [{ total }] = await knex("advertisements").count("id as total").where((builder) => {
                if (title) builder.where("title", "like", `%${title}%`);
                if (type) builder.where("type", type);
                if (status) builder.where("status", status);
                if (start_date) builder.where("created_at", ">=", start_date);
                if (end_date) builder.where("created_at", "<=", end_date);
            });
    
            const totalPages = Math.ceil(total / perPage);
    
            // Pagination
            const offset = (page - 1) * perPage;
            query.limit(perPage).offset(offset);
    
            const advertisements = await query;
    
            if (!advertisements || advertisements.length === 0) {
                return sendSuccessResponse("No advertisements found", { data: [], pagination: {} });
            }
    
            // Convert image filenames to full URLs
            const formattedAds = advertisements.map((ad) => ({
                ...ad,
                image_url: getUrl(ad.image, "image"),
            }));
    
            return sendSuccessResponse("Advertisements retrieved successfully", {
                data: formattedAds,
                pagination: {
                    currentPage: page,
                    perPage,
                    totalRecords: total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    nextPage: page < totalPages ? page + 1 : null,
                },
            });
        } catch (error) {
            return sendErrorResponse("Error retrieving advertisements", error);
        }
    }    
};

module.exports = Ads;