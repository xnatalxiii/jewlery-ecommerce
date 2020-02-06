const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const Contact = require("./../models/contactModel");

/*-------------------------------------------------- 
	- Create Contact - 
--------------------------------------------------*/
exports.createContact = catchAsync(async (req, res, next) => {
	const newContact = await Contact.create({
		name: req.body.name,
		email: req.body.email,
		message: req.body.message
	});

	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		data: {
			newContact
		}
	});
});

/*-------------------------------------------------- 
	- Get all contacts - 
--------------------------------------------------*/
exports.getAllContacts = catchAsync(async (req, res, next) => {
	const contacts = await Contact.find();
	res.status(200).json({
		status: "success",
		requestTime: req.requestTime,
		results: contacts.length,
		data: {
			contacts
		}
	});
});

/*-------------------------------------------------- 
	- Delete Contact - 
--------------------------------------------------*/
exports.deleteContact = catchAsync(async (req, res, next) => {
	const contact = await Contact.findByIdAndDelete(req.params.id);
	if (!contact) {
		return next(new AppError("No Contact found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: null
	});
});
