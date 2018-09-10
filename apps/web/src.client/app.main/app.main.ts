// Configure logger
// import * as log4js from "log4js";
// log4js.configure({
// 	appenders: {
// 		console: {
// 			type: "console",
// 			layout: {
// 				type: "pattern",
// 				pattern: "%d{hh:mm:ss} %p %c %m%n"
// 			}
// 		}
// 	},
// 	categories: {
// 		default: {
// 			appenders: ["console"],
// 			level: "trace"
// 		}
// 	}
// });

// const log = log4js.getLogger("app.main");
const log = {
	trace: console.log,
	fatal: console.log
};

import * as ko from "knockout";
import { sleep } from "@zxnode/base";

import AppViewModel from "./ViewModels/AppViewModel";

// Register widgets
log.trace("Registering Knockout widget: app-view");
ko.components.register("app-view", {
	template: require("./Views/AppView.html")
});

// Initializing and start
log.trace("Creating application view model");
const appVM = new AppViewModel();
log.trace("Initializing application view model");
Promise.all([
	appVM.init(),
	sleep(1)
]).then(() => {
	log.trace("Activates knockout.js");
	ko.applyBindings(appVM);
}).catch((reason) => {
	log.fatal("Crash", reason);
	alert("Crash");
	window.location.replace("broken.html");
});
