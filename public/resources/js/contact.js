import axios from "axios";
import { showUserMsg } from "./userMsg";

/*-------------------------------------------------
    - Create contact request -
-------------------------------------------------*/
export const createContact = async data => {
	// console.log(data);
	try {
		const res = await axios({
			method: "POST",
			url: `/api/contacts`,
			data
		});
		showUserMsg("success", "Gracias por tu mensaje. Pronto te contactaremos.");
	} catch (err) {
		console.log(err);
	}
};

/*-------------------------------------------------
    - Delete contact request -
-------------------------------------------------*/
export const deleteContact = async id => {
	try {
		const res = await axios({
			method: "DELETE",
			url: `/api/contacts/${id}`
		});
		if (res.data.status === "success") {
			location.assign("/admin/contacts");
		}
	} catch (err) {
		console.log(err);
	}
};
