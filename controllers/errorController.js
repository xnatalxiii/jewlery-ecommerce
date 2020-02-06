const AppError = require("./../utils/appError");

const handleCastErrorDB = err => {
	return new AppError(`Invalid ${err.path}: ${err.value}.`, 404);
};

const handleJWTError = () => new AppError("Invalid token, login again.", 401);

const handleJWTExpiredError = () => new AppError("Token has expired, login again.", 401);

const handleDuplicatedFieldsDB = err => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	// console.log(value);
	const message = `Duplicated field value: ${value}, use another value.`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(el => el.message);
	// console.log(errors);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
	//API ERROR HANDLING
	if (req.originalUrl.startsWith("/api")) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack
		});
	}
	// RENDERED WEBSITE
	return res
		.status(err.statusCode)
		.render("error", { title: "Something went wrong", msg: err.message, status: err.statusCode });
};

const sendErrorProd = (err, req, res) => {
	if (req.originalUrl.startsWith("/api")) {
		//OPERATIONAL ERROR TRUSTED ERROR: SEND MESSAGE TO CLIENT
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message
			});
		}
		//PROGRAMMING ERROR, WE DONT WANT TO LEAK ERROR DETAILS

		//1 LOG ERROR TO CONSOLE
		console.error("* ERROR *", err);
		//2 SEND GENERIC MESSAGE
		return res.status(500).json({
			status: "error",
			message: "something went wrong"
		});
	}
	//renderweb
	if (err.isOperational) {
		return res
			.status(err.statusCode)
			.render("error", { title: "Something went wrong", msg: err.message });
	}
	//1 LOG ERROR TO CONSOLE
	console.error("* ERROR *", err);
	//2 SEND GENERIC MESSAGE
	return res
		.status(err.statusCode)
		.render("error", { title: "Something went wrong", msg: "Try again later" });
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.message = err.message;
		if (error.name === "CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
		if (error.name === "ValidationError") error = handleValidationErrorDB(error);
		if (error.name === "JsonWebTokenError") error = handleJWTError();
		if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

		sendErrorProd(error, req, res);
	}
};
