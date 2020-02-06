/*-------------------------------------------------

	- Proyect: EN Jewlery
	- Date: Dec 2019
	- Author: Bryan Rodríguez

-------------------------------------------------*/

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const colors = require("colors");

/*--------------------------------------------------
	- dotenv config - 
--------------------------------------------------*/
dotenv.config({ path: "./config.env" });

/*--------------------------------------------------
	- DB Connection - 
--------------------------------------------------*/

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
console.log("-------------------- DB Connection init.");
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(con => {
		console.log("-------------------- DB connection was succesfull ~");
	});

/*--------------------------------------------------
	- Error handling - 
--------------------------------------------------*/
process.on("uncaughtException", err => {
	console.log("-------------------- Uncaught Exception ~".red);
	console.log(err.name, "-", err.message);
	console.log("Shutting down server");
	process.exit(1);
});

process.on("unhandledRejection", err => {
	console.log("-------------------- Unhandled Rejection ~".red);
	console.log(err.name, "-", err.message);
	server.close(() => {
		console.log("Shutting down server");
		process.exit(1);
	});
});

/*--------------------------------------------------
	- Starting Server - 
--------------------------------------------------*/
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log("\033[2J");
	console.log(
		`===================================================================================`
	);

	console.log(`-------------------- App running on port ${port} ~`);
});
