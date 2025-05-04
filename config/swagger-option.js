const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "GYM MEBERSHIP PORTAL API DOCUMENTATION",
			version: "1.0.0",
			description: "Demonstrating API documentation",
		},
	},
	apis: ["./app/controllers/**/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };