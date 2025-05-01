const knex = require("../../../config/db");
const { getUrl } = require("../../../services/helper");

const Classes = {
    findClassById: async (id) => {
		try {
            const singleClass = await knex("classes").where({ id }).first();
            if (!singleClass) return null;
    
            singleClass.featured_img = getUrl(singleClass.featured_img, "image");
    
            const schedules = await knex("class_schedules")
                .where({ class_id: id })
                .select("day_of_week", "start_time", "end_time");
    
            return { ...singleClass, schedules };
        } catch (error) {
            throw error;
        }
	},  

    listClasses: async (filters = {}) => {
        const { title, trainer_id, status, page = 1, perPage = 10 } = filters;
    
        const query = knex("classes").select("*").orderBy("created_at", "desc");
    
        if (title) query.where("title", "like", `%${title}%`);
        if (trainer_id) query.where("trainer_id", trainer_id);
        if (status !== undefined) query.where("status", status);
    
        const [{ total }] = await knex("classes").clone().count("id as total");
    
        const classes = await query.limit(perPage).offset((page - 1) * perPage);
    
        // Fetch schedules per class
        const classIds = classes.map(c => c.id);
        const schedules = await knex("class_schedules")
            .whereIn("class_id", classIds);
    
        // Group schedules by class_id
        const scheduleMap = {};
        for (const s of schedules) {
            if (!scheduleMap[s.class_id]) scheduleMap[s.class_id] = [];
            scheduleMap[s.class_id].push({
                day_of_week: s.day_of_week,
                start_time: s.start_time,
                end_time: s.end_time
            });
        }
    
        const formatted = classes.map(c => ({
            ...c,
            featured_img: getUrl(c.featured_img, "image"),
            schedules: scheduleMap[c.id] || []
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

module.exports = Classes;