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
    
    createClass: async (data) => {
        const {
            title, description, featured_img, centre_id, is_recurring, recurrence_pattern, status,
            schedules = [] // [{ day_of_week: 'Monday', start_time: '08:00', end_time: '09:00' }, ...]
        } = data;
    
        if (!title || !description) {
            throw new Error("Title and description are required");
        }
    
        const trx = await knex.transaction();
    
        try {
            // Insert into classes table
            const [classId] = await trx("classes").insert({
                title,
                description,
                featured_img: featured_img || "",
                centre_id: centre_id || null,
                is_recurring: is_recurring || false,
                recurrence_pattern: recurrence_pattern || null,
                status: status || 0,
            });
    
            // Insert schedules (if any)
            if (Array.isArray(schedules) && schedules.length) {
                const scheduleData = schedules.map(s => ({
                    class_id: classId,
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time,
                }));
                await trx("class_schedules").insert(scheduleData);
            }
    
            await trx.commit();
    
            return { id: classId };
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    },    

    editClass: async (id, data) => {
        if (!id) throw new Error("Invalid class ID");
    
        const {
            title, description, featured_img, centre_id,
            is_recurring, recurrence_pattern, status,
            schedules = [] // full new schedule array
        } = data;
    
        const trx = await knex.transaction();
    
        try {
            // Build update data
            const updateData = {};
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (featured_img) updateData.featured_img = featured_img;
            if (centre_id !== undefined) updateData.centre_id = centre_id;
            if (is_recurring !== undefined) updateData.is_recurring = is_recurring;
            if (recurrence_pattern) updateData.recurrence_pattern = recurrence_pattern;
            if (status !== undefined) updateData.status = status;
    
            await trx("classes").where({ id }).update(updateData);
    
            // Replace schedule (delete and insert new)
            await trx("class_schedules").where({ class_id: id }).del();
    
            if (Array.isArray(schedules) && schedules.length > 0) {
                const scheduleData = schedules.map(s => ({
                    class_id: id,
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time,
                }));
                await trx("class_schedules").insert(scheduleData);
            }
    
            await trx.commit();
            return true;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    },    

    deleteClassById: async (id) => {
        const trx = await knex.transaction();
    
        try {
            await trx("class_schedules").where({ class_id: id }).del();
            const deleted = await trx("classes").where({ id }).del();
    
            await trx.commit();
            return deleted > 0;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    },    

    listClasses: async (filters = {}) => {
        const { title, centre_id, status, page = 1, perPage = 10 } = filters;
    
        const query = knex("classes").select("*").orderBy("created_at", "desc");
    
        if (title) query.where("title", "like", `%${title}%`);
        if (centre_id) query.where("centre_id", centre_id);
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