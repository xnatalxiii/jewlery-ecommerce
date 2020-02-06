const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Nombre requerido."]
	},
	email: {
		type: String,
		required: [true, "Email requerido"]
	},
	message: {
		type: String,
		required: [true, "Mensaje requerido"]
	},
	contactDate: Date,
	formatedDate: String
});

contactSchema.pre("save", function(next) {
	this.contactDate = Date.now();

	let d = new Date(Date.now());
	let month = "" + (d.getMonth() + 1);
	let day = "" + d.getDate();
	let year = d.getFullYear();

	if (month.length < 2) month = "0" + month;
	if (day.length < 2) day = "0" + day;

	this.formatedDate = [day, month, year].join("-");

	next();
});

/*-------------------------------------------------- 
	- Model export -
--------------------------------------------------*/
const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
