import * as bodyParser from "body-parser";
import * as express from "express";
import * as http from "http";
import * as log4js from "log4js";
import * as morgan from "morgan";  // Logging middleware
import * as path from "path";
import * as uuid from "uuid";

import { default as configManager } from "./conf";
//import routes from "./routes";

log4js.configure(path.join(__dirname, "..", "log4js.config.json"));

const log = log4js.getLogger("main");

log.info("Initializing application...");

const app = express();

{ // Implement shutdown link. The application will exit by GET request to /shutdown
	const isAllowedShutdowLink: boolean = configManager.getEnabled("server.shutdownlink");
	if (isAllowedShutdowLink) {
		log.info("Apply /shutdown link");
		app.use(bodyParser.urlencoded({ extended: false }));
		const shutdownKey = uuid.v1();
		app.get("/shutdown", function (req: express.Request, res: express.Response): any {
			return res
				.header("Content-Type: text/html")
				.send("<form method='POST'>"
					+ "<input type='hidden' name='key' value='" + shutdownKey + "'>"
					+ "<input type='submit' value='Shutdown'>"
					+ "</form>");
		});
		app.post("/shutdown", function (req: express.Request, res: express.Response): any {
			const body = req.body;
			if (!body || !body.key || body.key !== shutdownKey) {
				return res.redirect(req.path);
			}
			return res
				.header("Content-Type: text/plain")
				.send("Shutdown the application")
				.on("finish", function () { process.exit(0); });
		});
	}
}

//app.use(bodyParser.json());

// Set logger. Available values: "dev", "short", "tiny". or no argument (default)
app.use(morgan("dev"));

// Static content
app.use("/", express.static(path.join(__dirname, "..", "src.client", "app.main")));

//app.use(routes);

// 404 Not found (bad URL)
app.use(function (req: express.Request, res: express.Response): any {
	return res.status(404).end("404 Not Found");
});

// 5xx Fatal error
app.use(function (err: any, req: express.Request, res: express.Response): any {
	if (err) {
		//TODO: send email, log err, etc...
		log.error(err);
	}
	return res.status(500).end("500 Internal Error");
});

// Make HTTP server instance
const server = http.createServer(app);

// Register "listening" callback
server.on("listening", function (): any {
	const address = server.address();
	if (typeof address === "string") {
		log.info(`Server was started on ${address}`);
	} else {
		log.info(address.family + " server was started on http://" + address.address + ":" + address.port);
	}
});

const listen: string = configManager.getString("server.listen.host");
const port: number = configManager.getInt("server.listen.port");

// Start listening
server.listen(port, listen);

log.info("Starting HTTP Web Server...");
