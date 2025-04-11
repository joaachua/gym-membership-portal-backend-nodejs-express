const knex = require("../../../config/db");

const Membership = {
	findMembershipById: async (id) => {
        const membership = await knex("memberships").where({ id }).first();
    
        if (!membership) return null;
    
        const benefits = await knex("membership_benefits_relation")
            .join("membership_benefits", "membership_benefits_relation.benefit_id", "=", "membership_benefits.id")
            .where("membership_benefits_relation.membership_id", id)
            .select("membership_benefits.*");
    
        return { ...membership, benefits };
    },

    storeMembership: async (data) => {
        const {
            plan_name,
            category,
            price,
            duration_in_months,
            access_level,
            description,
            benefits = []
        } = data;
    
        const membershipId = await knex("memberships").insert({
            plan_name,
            category,
            price,
            duration_in_months,
            access_level,
            description
        }).returning("id");
    
        if (benefits.length > 0) {
            const benefitRelations = benefits.map(benefitId => ({
                membership_id: membershipId[0],
                benefit_id: benefitId
            }));
    
            await knex("membership_benefits_relation").insert(benefitRelations);
        }
    
        return membershipId[0];
    },

    updateMembership: async (id, data) => {
        const {
            plan_name,
            category,
            price,
            duration_in_months,
            access_level,
            description,
            benefits = []
        } = data;
    
        await knex("memberships").where({ id }).update({
            plan_name,
            category,
            price,
            duration_in_months,
            access_level,
            description
        });
    
        await knex("membership_benefits_relation").where({ membership_id: id }).del();
    
        if (benefits.length > 0) {
            const benefitRelations = benefits.map(benefitId => ({
                membership_id: id,
                benefit_id: benefitId
            }));
    
            await knex("membership_benefits_relation").insert(benefitRelations);
        }
    
        return true;
    },    

    deleteMembership: async (id) => {
        await knex("membership_benefits_relation").where({ membership_id: id }).del();
    
        return knex("memberships").where({ id }).del();
    },

	listMemberships: async (filters = {}, page = 1, perPage = 10) => {
        const query = knex("memberships");
    
        // Apply filters
        if (filters.plan_name) {
            query.where("plan_name", "like", `%${filters.plan_name}%`);
        }
    
        if (filters.category) {
            query.where("category", filters.category);
        }
    
        if (filters.access_level) {
            query.where("access_level", filters.access_level);
        }
    
        if (filters.price_min) {
            query.where("price", ">=", filters.price_min);
        }
    
        if (filters.price_max) {
            query.where("price", "<=", filters.price_max);
        }
    
        // Get total count of memberships for pagination
        const totalEntries = await query.clone().count({ count: "*" }).first();
        const totalItems = parseInt(totalEntries.count, 10); // Convert count to integer
    
        // Calculate total pages
        const totalPages = Math.ceil(totalItems / perPage);
    
        // Fetch paginated memberships
        const offset = (page - 1) * perPage;
        const memberships = await query
            .limit(perPage)
            .offset(offset)
            .orderBy("created_at", "desc");
    
        // Fetch benefits for each membership
        for (let membership of memberships) {
            const benefits = await knex("membership_benefits_relation")
                .join("membership_benefits", "membership_benefits_relation.benefit_id", "=", "membership_benefits.id")
                .where("membership_benefits_relation.membership_id", membership.id)
                .select("membership_benefits.*");
    
            membership.benefits = benefits;
        }
    
        // Calculate pagination data
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        const nextPage = hasNextPage ? page + 1 : null;
        const previousPage = hasPreviousPage ? page - 1 : null;
    
        // Return memberships with pagination metadata
        return {
            currentPage: page,
            totalPages,
            totalItems,
            nextPage,
            previousPage,
            hasNextPage,
            hasPreviousPage,
            data: memberships,
        };
    },    
};

module.exports = Membership;
