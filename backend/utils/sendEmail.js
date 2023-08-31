import "dotenv/config";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../helpers/emailTransport.js";
import { systemLogs } from "./Logger.js";

// Get the file path of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module's file path
const __dirname = path.dirname(__filename);

const sendEmail = async (email, subject, payload, template) => {
	try {
        //// Read the content of the template file
		const sourceDirectory = fs.readFileSync(
			path.join(__dirname, template),
			"utf8"
		);
        
        //Compile the template using Handlebars
		const compiledTemplate = handlebars.compile(sourceDirectory);

		const emailOptions = {
			from: process.env.SENDER_EMAIL,
			to: email,
			subject: subject,
			html: compiledTemplate(payload), // Rendered HTML content using the compiled template
		};
		await transporter.sendMail(emailOptions);
	} catch (error) {
		systemLogs.error(`email not sent: ${error}`);
	}
};

export default sendEmail;