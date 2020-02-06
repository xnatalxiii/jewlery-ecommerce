const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Nombre requerido."]
		},
		email: {
			type: String,
			required: [true, "Email requerido."],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Email con formato incorrecto."]
		},
		type: {
			type: String,
			enum: ["user", "admin"],
			default: "user"
		},
		cart: [
			{
				product: {
					type: mongoose.Schema.ObjectId,
					ref: "Product"
				},
				quantity: {
					type: Number,
					required: [true, "Product must have quantity"]
				}
			}
		],
		password: {
			type: String,
			required: [true, "Proveer password."],
			minlenght: 8,
			select: false
		},
		passwordConfirm: {
			type: String,
			required: [true, "Confirmar password."],
			//THIS ONLY WORKS ON CREATE AND SAVE -- PORLO QYE EN EL UPDATE TENEMOS QUE USAR SAVE
			validate: {
				validator: function(el) {
					return el === this.password;
				},
				message: "Error al confirmar el password."
			},
			select: false
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Virtual populate
userSchema.virtual("orders", {
	ref: "Order",
	foreignField: "user",
	localField: "_id"
});

userSchema.set("toObject", { virtuals: true });

/*-------------------------------------------------- 
	- Pre middleware: to hash password -
--------------------------------------------------*/
userSchema.pre("save", async function(next) {
	// - TODO: comment
	if (!this.isModified("password")) return next();

	// - Hash password
	this.password = await bcrypt.hash(this.password, 12);

	// - Removing passwordConfirm
	this.passwordConfirm = undefined;

	next();
});

/*-------------------------------------------------- 
	- Pre middleware:
	to save password changed at Timestamp -
--------------------------------------------------*/
userSchema.pre("save", function(next) {
	// - TODO: comment
	if (!this.isModified("password" || this.isNew)) return next();

	// - Time when password changed -1sec
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, function(next) {
	// this.select("+name");
	this.populate({
		path: "cart.product"
	});

	console.log("---------------------------------------------".cyan);
	next();
});

/*-------------------------------------------------- 
	- Method correctPassword: check password -
--------------------------------------------------*/
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

/*-------------------------------------------------- 
	- Method changedPasswordAfter:
	check if token was generated before
	changing the password -
--------------------------------------------------*/
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		console.log(
			`-------------------- Password changed Timestamps:${changedTimestamp} JWT:${JWTTimestamp}`
				.yellow
		);
		return JWTTimestamp < changedTimestamp;
	}
	///false means the user has not changed the password
	return false;
};

/*-------------------------------------------------- 
	- Password reset token -
--------------------------------------------------*/
userSchema.methods.createPasswordResetToken = function() {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// - Token valid time: 10min
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

/*-------------------------------------------------- 
	- Model export -
--------------------------------------------------*/

const User = mongoose.model("User", userSchema);
module.exports = User;
