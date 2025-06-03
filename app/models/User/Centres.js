const knex = require("../../../config/db");
const { getUrl } = require("../../../services/helper");

const Centres = {
    findCentreById: async (id) => {
		try {
            const centre = await knex("centres").where({ id }).first();
            if (!centre) return null;
    
            centre.featured_img = getUrl(centre.featured_img, "image");
    
            const centre_schedules = await knex("centre_schedules")
                .where({ centre_id: id })
                .select("day_of_week", "start_time", "end_time");
            
            const centre_tags = await knex("centre_tags")
                .where({ centre_id: id })
                .select("tag_name");
    
            return { ...centre, centre_schedules, centre_tags };
        } catch (error) {
            throw error;
        }
	},

    listCentres: async (filters = {}) => {
        const { name, page = 1, perPage = 10 } = filters;
    
        const query = knex("centres").select("*").orderBy("created_at", "desc");
    
        if (name) query.where("name", "like", `%${name}%`);
    
        const [{ total }] = await knex("centres").clone().count("id as total");
    
        const centres = await query.limit(perPage).offset((page - 1) * perPage);
    
        // Fetch schedules per centre
        const centreIds = centres.map(c => c.id);
        const schedules = await knex("centre_schedules")
            .whereIn("centre_id", centreIds);

        // Fetch schedules per centre
        const tags = await knex("centre_tags")
            .whereIn("centre_id", centreIds);
    
        // Group schedules by centre_id
        const scheduleMap = {};
        for (const s of schedules) {
            if (!scheduleMap[s.centre_id]) scheduleMap[s.centre_id] = [];
            scheduleMap[s.centre_id].push({
                day_of_week: s.day_of_week,
                start_time: s.start_time,
                end_time: s.end_time
            });
        }

        // Group tags by centre_id
        const tagMap = {};
        for (const s of tags) {
            if (!tagMap[s.centre_id]) tagMap[s.centre_id] = [];
            tagMap[s.centre_id].push({
                tag: s.tag_name
            });
        }
    
        const formatted = centres.map(c => ({
            ...c,
            featured_img: getUrl(c.featured_img, "image"),
            schedules: scheduleMap[c.id] || [],
            tags: tagMap[c.id] || []
        }));
    
        return {
            data: formatted,
            pagination: {
                currentPage: page,
                perPage,
                totalRecords: total,
                totalPages: Math.ceil(total / perPage),
                hasNextPage: page * perPage < total,
                nextPage: page * perPage < total ? page + 1 : null,
            }
        };
    },
    
};

module.exports = Centres;