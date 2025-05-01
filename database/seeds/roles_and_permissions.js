/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
	const roles = [
		{ role: "Super Admin" },
		{ role: "Admin" },
		{ role: "Marketing" },
		{ role: "Sales" },
	];

	await Promise.all(
		roles.map(async (role) => {
			await knex("roles").insert(role).onConflict("role").ignore();
		})
	);

	const roleIds = await knex("roles").select("id", "role");
	const roleMap = roleIds.reduce((acc, role) => {
		acc[role.role] = role.id;
		return acc;
	}, {});

	const permissions = [
		{ permission_group: "Ads Management", permission_name: "Create" },
		{ permission_group: "Ads Management", permission_name: "List" },
		{ permission_group: "Ads Management", permission_name: "Edit" },
		{ permission_group: "Ads Management", permission_name: "View" },
		{ permission_group: "Ads Management", permission_name: "Delete" },
	];

	await Promise.all(
		permissions.map(async (permission) => {
			await knex("permissions")
				.insert(permission)
				.onConflict(["permission_group", "permission_name"])
				.ignore();
		})
	);

	const permissionIds = await knex("permissions").select(
		"id",
		"permission_group",
		"permission_name"
	);
	const permissionMap = permissionIds.reduce((acc, perm) => {
		acc[`${perm.permission_group}-${perm.permission_name}`] = perm.id;
		return acc;
	}, {});

	const rolePermissions = [
    //Super Admin Role Permissions
		{
			role_id: roleMap["Super Admin"],
			permission_id: permissionMap["Ads Management-Create"],
		},
		{
			role_id: roleMap["Super Admin"],
			permission_id: permissionMap["Ads Management-List"],
		},
		{
			role_id: roleMap["Super Admin"],
			permission_id: permissionMap["Ads Management-View"],
		},
		{
			role_id: roleMap["Super Admin"],
			permission_id: permissionMap["Ads Management-Edit"],
		},
		{
			role_id: roleMap["Super Admin"],
			permission_id: permissionMap["Ads Management-Delete"],
		},

		// Admin Role Permissions
		{
			role_id: roleMap["Admin"],
			permission_id: permissionMap["Ads Management-Create"],
		},
		{
			role_id: roleMap["Admin"],
			permission_id: permissionMap["Ads Management-List"],
		},
		{
			role_id: roleMap["Admin"],
			permission_id: permissionMap["Ads Management-View"],
		},
		{
			role_id: roleMap["Admin"],
			permission_id: permissionMap["Ads Management-Edit"],
		},
		{
			role_id: roleMap["Admin"],
			permission_id: permissionMap["Ads Management-Delete"],
		},
	];

	await Promise.all(
		rolePermissions.map(async (rolePermission) => {
			await knex("role_permissions")
				.insert(rolePermission)
				.onConflict(["role_id", "permission_id"])
				.ignore();
		})
	);

	await knex("role_permissions")
		.whereNotIn(
			["permission_id"],
			knex("permissions")
				.select("id")
				.whereIn(
					["permission_group", "permission_name"],
					permissions.map((p) => [p.permission_group, p.permission_name])
				)
		)
		.del();

	await knex("permissions")
		.whereNotIn(
			"id",
			rolePermissions.map((rp) => rp.permission_id)
		)
		.del();
};
