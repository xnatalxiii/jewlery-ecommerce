const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// const sendEmail = require("./../utils/email");
const Email = require("./../utils/email");

/*-------------------------------------------------- 
	- Cookie options - 
--------------------------------------------------*/
const cookieOptions = {
	expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
	//para que solo jale en https
	// secure: true,
	//para que no se pueda acceder a la cookie mediante el browser, solo http
	httpOnly: true
};
if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

/*-------------------------------------------------- 
	- Token config - 
--------------------------------------------------*/
const signToken = id => {
	return jwt.sign({ id: id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
};

/*-------------------------------------------------- 
	- Creating and sending token - 
--------------------------------------------------*/
const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	res.cookie("jwt", token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user
		}
	});
};

/*-------------------------------------------------- 
	- Signup - 
--------------------------------------------------*/
exports.signup = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email }, "name email password");

	if (user) {
		return next(new AppError("El email ya esta registrado.", 402));
	}

	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
		type: req.body.type
	});

	const url = `${req.protocol}://${req.get("host")}/account`;
	await new Email(newUser, url).sendWelcome();

	// console.log(`-------------------- User created: ~`.green);
	// console.log(newUser);

	createSendToken(newUser, 201, res);
});

/*-------------------------------------------------- 
	- Login - 
--------------------------------------------------*/
exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	//1) Chek if email and passwords exist.
	// console.log(`-------------------- Credentials Trying to login ~`);
	// console.log(req.body);
	if (!email || !password) {
		return next(new AppError("Please provide email and password.", 400));
	}

	//2) Check if the user exxists and the password is correct
	const user = await User.findOne({ email }, "name email password");
	if (!user || !(await user.correctPassword(password, user.password))) {
		//401 is unauthorized
		// console.log(`-------------------- Incorrect email or password ~`.red);
		return next(new AppError("Incorrect email or password.", 401));
	}
	// console.log(`-------------------- ${user.email} is logged in ~`.cyan);

	//3) If everything is ok, send the token
	createSendToken(user, 200, res);
});

/*-------------------------------------------------- 
	- isLoggedIn: doesn't return any errors - 
--------------------------------------------------*/
exports.isLoggedIn = async (req, res, next) => {
	try {
		if (req.cookies.jwt) {
			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
			//3 - check if user still exists
			const currentUser = await User.findById(decoded.id);

			if (!currentUser) {
				return next();
			}
			//4 - Check if user changed password agter JWT token was issued
			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}

			//attach it to the respones.locals files to be used in the pug views
			res.locals.user = currentUser;
			return next();
		}
		res.locals.user = undefined;
	} catch (error) {
		res.locals.user = undefined;
		return next();
	}
	next();
};

/*-------------------------------------------------- 
	- protect: a user has to be logged in to get - 
--------------------------------------------------*/
exports.protect = catchAsync(async (req, res, next) => {
	//1.- getting token and check if its here
	// console.log(`-------------------- Protect Middleware ~`);
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		// console.log(`-------------------- There is any token to check ~`.red);
		return next(new AppError("You are not loged in, please login to get access", 401));
	}

	//2 - verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	//3 - check if user still exists
	const currentUser = await User.findById(decoded.id);

	if (!currentUser) {
		// console.log(`-------------------- Token belongs to an inexistent user ~`.red);
		return next(new AppError("Tht user that belongs to the token does not longer exists", 401));
	}
	//4 - Check if user changed password after JWT token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		// console.log(`-------------------- Token expired by password changed ~`.red);
		return next(new AppError("Password changed recently, login again", 401));
	}

	///IF CODE COMES HJERE WITHOUT ERRORS,, GIVES ACCESS TO THE PROTECTED ROUTE
	//AQUI GUARDAMOS EL USUARIO EN REQ.USER PARA QUE EN EL SIGUIENTE MIDDLEWARE TENGAMOS ACCESO AL USUARIO ACTUAL
	// console.log(`-------------------- Token valid ~`.green);

	//req.user para enviar el user entre funciones del backend
	req.user = currentUser;
	// console.log("HERE1".red);
	//res.localsusers para enviar datos para usarse en los archivos .pug
	res.locals.user = currentUser;

	next();
});

/*-------------------------------------------------- 
	- restrict to sertain users type - 
--------------------------------------------------*/
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.type)) {
			return next(new AppError("You do not haver permission to perform this action", 403));
		}

		next();
	};
};

/*-------------------------------------------------- 
	- logout - 
--------------------------------------------------*/
exports.logout = (req, res) => {
	// console.log(`-------------------- Current user logged out ~`.red);
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});
	res.locals.user = undefined;
	res.status(200).json({ status: "success" });
};

/*-------------------------------------------------- 
	- Update password - 
--------------------------------------------------*/
exports.updatePassword = catchAsync(async (req, res, next) => {
	// 1 get the user from the collecction

	// console.log(`-------------------- 1 Changing ${req.user} password ~`);

	const user = await User.findById(req.user._id).select("password");

	// console.log(`-------------------- 2 Changing ${user} password ~`);

	const { password, newPassword, newPasswordConfirm } = req.body;

	if (!password || !newPassword || !newPasswordConfirm) {
		return next(new AppError("Please fill the requirements", 401));
	}

	//2 check if postd password is correct
	if (!(await user.correctPassword(password, user.password))) {
		return next(new AppError("Password incorrecto.", 401));
	}

	//3 if the password is correct, then update the password
	user.password = newPassword;
	user.passwordConfirm = newPasswordConfirm;
	user.passwordChangedAt = Date.now();

	await user.save();
	//4 log the user in sending JWT
	createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	//1get user based on posted email
	user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError("Theres no user with that email address", 404));
	}
	//2 generate random token
	const resetToken = user.createPasswordResetToken();

	await user.save({ validateBeforeSave: false });

	//3 send it back as an email
	const url = `${req.protocol}://${req.get("host")}/resetPass/${resetToken}`;

	try {
		await new Email(user, url).sendPasswordReset();
		user = undefined;
		res.status(200).json({
			status: "success",
			message: "token sent to email"
		});
	} catch (err) {
		user.createPasswordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		user = undefined;
		return next(new AppError("There was an error sending the email."), 500);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	//1 get user based on token

	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() }
	});

	//2 if token no t expired, and user exisst, set new password
	if (!user) {
		return next(new AppError("Token invalid", 400));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.createPasswordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	//3 update changedpasswordAt

	//4 log the use in sending jwt

	const token = signToken(user._id);
	res.cookie("jwt", token, cookieOptions);
	res.status(200).json({
		status: "success",
		token
	});
});
