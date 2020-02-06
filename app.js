/*-------------------------------------------------

	- Proyect: EN Jewlery
	- Date: Dec 2019
	- Author: Bryan Rodríguez

-------------------------------------------------*/

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");

const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const errorController = require("./controllers/errorController");
const viewRouter = require("./routes/viewRoutes");
const userRouter = require("./routes/userRoutes");
const contactRouter = require("./routes/contactRoutes");
const orderRouter = require("./routes/orderRoutes");
const adminRouter = require("./routes/adminRoutes");
const productRouter = require("./routes/productRoutes");

/*--------------------------------------------------
	- Express init - 
--------------------------------------------------*/
const app = express();

/*--------------------------------------------------
	- View engine - 
--------------------------------------------------*/
app.set("view engine", "pug");

/*--------------------------------------------------
	- Views path - 
--------------------------------------------------*/
app.set("views", path.join(__dirname, "views"));

/*-------------------------------------------------- 
	- Serving static files - 
--------------------------------------------------*/
app.use(express.static(path.join(__dirname, "public")));

/*-------------------------------------------------- 
	- Body parser: to read json - 
--------------------------------------------------*/
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
/*-------------------------------------------------- 
	- Cookie parser: to read cookies - 
--------------------------------------------------*/
app.use(cookieParser());

/*-------------------------------------------------- 
	- Compression: for text compression - 
--------------------------------------------------*/
app.use(compression());

/*-------------------------------------------------- 
	- Helmet: HTTP security headers - 
--------------------------------------------------*/
app.use(helmet());

/*-------------------------------------------------- 
	- Express rate limit: IP Limit requests from same API - 
--------------------------------------------------*/
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again later!"
});
app.use("/api", limiter);

/*-------------------------------------------------- 
	- Mongo sanitize: Data sanitization against NoSQL query injection - 
--------------------------------------------------*/
app.use(mongoSanitize());

/*-------------------------------------------------- 
	- XSS : Data sanitization against XSS- 
--------------------------------------------------*/
app.use(xss());

/*-------------------------------------------------- 
	- Middleware Check - 
--------------------------------------------------*/
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	console.log(`\n-------------------- Middleware Check ~`);

	next();
});

/*-------------------------------------------------- 
	- Routes handler - 
--------------------------------------------------*/
//	- Views -
app.use("/", viewRouter);

//	- Admin -
app.use("/admin", adminRouter);

//	- API -
app.use("/api/users", userRouter);

app.use("/api/contacts", contactRouter);

app.use("/api/products/", productRouter);

app.use("/api/orders", orderRouter);

//	- Unhandled routes
app.all("*", (req, res, next) => {
	next(new AppError(`Can't find asd ${req.originalUrl}.`, 404));
});

/*-------------------------------------------------- 
	- General error handler: based in enviroment - 
--------------------------------------------------*/
app.use(errorController);

/*-------------------------------------------------- 
	- app export: to be used on server.js - 
--------------------------------------------------*/
module.exports = app;
