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
    
    createCentre: async (data) => {
        const {
            name, description, featured_img, location,
            centre_schedules = [], // [{ day_of_week: 'Monday', start_time: '08:00', end_time: '09:00' }, ...]
            centre_tags = []
        } = data;
    
        if (!name || !description) {
            throw new Error("Name and description are required");
        }
    
        const trx = await knex.transaction();
    
        try {
            // Insert into centres table
            const [centreId] = await trx("centres").insert({
                name,
                description,
                featured_img: featured_img || "",
                location: location || ""
            });
    
            // Insert schedules (if any)
            if (Array.isArray(centre_schedules) && centre_schedules.length) {
                const scheduleData = schedules.map(s => ({
                    centre_id: centreId,
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time,
                }));
                await trx("centre_schedules").insert(scheduleData);
            }

            // Insert tags (if any)
            if (Array.isArray(centre_tags) && centre_tags.length) {
                const tagsData = tags.map(s => ({
                    centre_id: centreId,
                    tag_name: s.name
                }));
                await trx("centre_tags").insert(tagsData);
            }
    
            await trx.commit();
    
            return { id: centreId };
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    },    

    editCentre: async (id, data) => {
        if (!id) throw new Error("Invalid centre ID");
    
        const {
            name, description, featured_img, location,
            centre_schedules = [], // full new schedule array
            centre_tags = []
        } = data;
    
        const trx = await knex.transaction();
    
        try {
            // Build update data
            const updateData = {};
            if (name) updateData.name = name;
            if (description) updateData.description = description;
            if (featured_img) updateData.featured_img = featured_img;
            if (location) updateData.location = location;
            await trx("centres").where({ id }).update(updateData);
    
            // Replace schedule (delete and insert new)
            await trx("centre_schedules").where({ centre_id: id }).del();
    
            if (Array.isArray(centre_schedules) && centre_schedules.length > 0) {
                const scheduleData = schedules.map(s => ({
                    centre_id: id,
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time,
                }));
                await trx("centre_schedules").insert(scheduleData);
            }
    
            // Replace schedule (delete and insert new)
            await trx("centre_tags").where({ centre_id: id }).del();
    
            if (Array.isArray(centre_tags) && centre_tags.length > 0) {
                const tagsData = tags.map(s => ({
                    centre_id: id,
                    tag_name: s.name
                }));
                await trx("centre_tags").insert(tagsData);
            }

            await trx.commit();
            return true;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    },    

    deleteCentreById: async (id) => {
        const trx = await knex.transaction();
    
        try {
            await trx("centre_tags").where({ centre_id: id }).del();
            await trx("centre_schedules").where({ centre_id: id }).del();
            const deleted = await trx("centres").where({ id }).del();
    
            await trx.commit();
            return deleted > 0;
        } catch (error) {
            await trx.rollback();
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