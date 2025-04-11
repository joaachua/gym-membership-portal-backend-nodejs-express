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

	listMemberships: async (filters = {}, perPage = 10, page = 1) => {
        const query = knex("memberships");
    
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
    
        const offset = (page - 1) * perPage;
        const memberships = await query.limit(perPage).offset(offset);
    
        for (let membership of memberships) {
            const benefits = await knex("membership_benefits_relation")
                .join("membership_benefits", "membership_benefits_relation.benefit_id", "=", "membership_benefits.id")
                .where("membership_benefits_relation.membership_id", membership.id)
                .select("membership_benefits.*");
    
            membership.benefits = benefits;
        }
    
        return memberships;
    },
};

module.exports = Membership;