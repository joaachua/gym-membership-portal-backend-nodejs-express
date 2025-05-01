/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  const users = [
    {
      salutation: 'MR.',
      username: 'superadmin',
      full_name: 'Super Admin',
      email: 'superadmin@example.com',
      phone_number: '+1234567890',
      password: await bcrypt.hash('SuperAdmin@1234', 10),
      is_verified: true,
      role: 1,
      platform: 2,
      otp_code: null,
      otp_sent_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      salutation: 'MR.',
      username: 'admin',
      full_name: 'Admin',
      email: 'admin@example.com',
      phone_number: '+0987654321',
      password: await bcrypt.hash('Admin@1234', 10),
      is_verified: true,
      role: 2,
      platform: 2,
      otp_code: null,
      otp_sent_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      salutation: 'MR.',
      username: 'marketing',
      full_name: 'Marketing',
      email: 'marketing@example.com',
      phone_number: '+0987654321',
      password: await bcrypt.hash('Marketing@1234', 10),
      is_verified: true,
      role: 3,
      platform: 2,
      otp_code: null,
      otp_sent_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      salutation: 'MR.',
      username: 'sales',
      full_name: 'Sales',
      email: 'sales@example.com',
      phone_number: '+0987654321',
      password: await bcrypt.hash('Sales@1234', 10),
      is_verified: true,
      role: 4,
      platform: 2,
      otp_code: null,
      otp_sent_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  for (const user of users) {
    const exists = await knex('users').where('email', user.email).first();

    if (!exists) {
      await knex('users').insert(user);
    }
  }
};