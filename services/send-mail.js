const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
	},
});

const sendMail = async (to, subject, templateName, templateData) => {
	try {
		const templatePath = path.join(__dirname, "./email-templates", `${templateName}.html`);
		const source = fs.readFileSync(templatePath, "utf8");
		const compiledTemplate = handlebars.compile(source);
		const html = compiledTemplate(templateData);

		await transport.sendMail({
			from: process.env.MAIL_USERNAME,
			to,
			subject,
			html,
		});

		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		return false;
	}
};

module.exports = { sendMail };