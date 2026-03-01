"use strict";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash("password123", saltRounds);

    const users = [
      {
        id: uuidv4(),
        email: "admin@example.com",
        pwd: defaultPassword,
        name: "Admin User",
        default_currency: "RUB",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: "john.doe@example.com",
        pwd: defaultPassword,
        name: "John Doe",
        default_currency: "USD",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        email: "anna.smith@example.com",
        pwd: defaultPassword,
        name: "Anna Smith",
        default_currency: "EUR",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", {
      email: [
        "admin@example.com",
        "john.doe@example.com",
        "anna.smith@example.com",
      ],
    });
  },
};
