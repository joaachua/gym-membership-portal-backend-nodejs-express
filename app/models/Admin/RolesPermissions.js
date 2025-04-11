const knex = require("../../../config/db");

const RolesPermissions = {
	findRoleById: async (id) => {
		return knex("roles").where({ id }).first();
	},

	findRoleByName: async (role) => {
		return knex("roles").where({ role }).first();
	},

	storeRole: async (role) => {
		const [roleId] = await knex("roles")
			.insert({ role })
			.onConflict("role")
			.ignore()
			.returning("id");

		if (!roleId) {
			const existingRole = await Role.findRoleByName(role);
			return existingRole.id;
		}

		return roleId;
	},

	assignPermissionsToRole: async (roleId, permissionIds) => {
		const rolePermissions = permissionIds.map((permissionId) => ({
			role_id: roleId,
			permission_id: permissionId,
		}));

		await knex("role_permissions")
			.insert(rolePermissions)
			.onConflict(["role_id", "permission_id"])
			.ignore();
	},

	updateRole: async (id, role, permissionIds) => {
		if (role){
			await knex("roles").where({ id }).update({ role });
		}

		await knex("role_permissions").where({ role_id: id }).del();

		await Role.assignPermissionsToRole(id, permissionIds);
	},

	deleteRole: async (id) => {
		await knex("role_permissions").where({ role_id: id }).del();

		await knex("roles").where({ id }).del();
	},

	listRoles: async (roleName = "", page = 1, perPage = 10) => {
		const offset = (page - 1) * perPage;

		const rolesQuery = knex("roles")
			.select("roles.id as role_id", "roles.role", "roles.created_at")
			.where("roles.role", "LIKE", `%${roleName}%`)
			.orderBy("roles.created_at", "desc")
			.limit(perPage)
			.offset(offset);
	
		const roles = await rolesQuery;
        
		const totalItemsResult = await knex("roles")
			.where("roles.role", "LIKE", `%${roleName}%`)
			.countDistinct("roles.id as count");
		const totalEntries = parseInt(totalItemsResult[0].count, 10);
		const totalPages = Math.ceil(totalEntries / perPage);
        
		const roleIds = roles.map((role) => role.role_id);
	
		const permissions = await knex("role_permissions")
			.leftJoin(
				"permissions",
				"role_permissions.permission_id",
				"permissions.id"
			)
			.select(
				"role_permissions.role_id",
				"permissions.permission_group",
				"permissions.permission_name"
			)
			.whereIn("role_permissions.role_id", roleIds);
	
		// Create roleMap and sort by created_at in descending order
		const roleMap = roles.reduce((acc, role) => {
			acc[role.role_id] = {
				id: role.role_id,
				role: role.role,
				created_at: role.created_at,
				permissions: [],
			};
			return acc;
		}, {});
	
		// Aggregate permissions for each role
		permissions.forEach((permission) => {
			if (roleMap[permission.role_id]) {
				roleMap[permission.role_id].permissions.push({
					permission_group: permission.permission_group,
					permission_name: permission.permission_name,
				});
			}
		});
	
		// Sort roleMap by created_at in descending order
		const sortedRoleMap = Object.values(roleMap).sort((a, b) => {
			return new Date(b.created_at) - new Date(a.created_at);
		});
	
		return {
			currentPage: page,
			totalPages,
			totalItems: totalEntries,
			nextPage: page < totalPages ? page + 1 : null,
			previousPage: page > 1 ? page - 1 : null,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1,
			data: sortedRoleMap,
		};
	},	

	findRoleByIdWithPermissions: async (id) => {
		return knex("roles")
			.where({ id })
			.first()
			.then(async (role) => {
				if (!role) return null;

				const permissions = await knex("role_permissions")
					.leftJoin(
						"permissions",
						"role_permissions.permission_id",
						"permissions.id"
					)
					.where({ role_id: id })
					.select(
						"permissions.permission_group",
						"permissions.permission_name"
					);

				return {
					id: role.id,
					role: role.role,
					permissions,
				};
			});
	},

	fetchAllRoleNames: async () => {
		const rolesQuery = knex("roles")
			.select("roles.role")
			.orderBy("roles.role", "asc");
	
		const roles = await rolesQuery;
	
		const roleNames = roles.map(role => role.role);
	
		return roleNames;
	},

    findPermissionById: async (id) => {
		return knex("permissions").where({ id }).first();
	},

	findPermissionByName: async (permission_group, permission_name) => {
		return knex("permissions")
			.where({ permission_group, permission_name })
			.first();
	},

	fetchAllPermissions: async () => {
		const permissionsQuery = knex("permissions")
			.select("id", "permission_group", "permission_name")
			.orderBy("id", "asc"); 
	
		const permissions = await permissionsQuery;
	
		const permissionDetails = permissions.map(permission => ({
			id: permission.id,
			group: permission.permission_group,
			name: permission.permission_name
		}));
	
		return permissionDetails;
	},
};

module.exports = RolesPermissions;