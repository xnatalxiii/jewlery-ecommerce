import axios from "axios";
import { showUserMsg, showUserMsg2 } from "./userMsg";

/*-------------------------------------------------
    - Update user data request -
-------------------------------------------------*/
export const updateData = async data => {
	showUserMsg("success", ". . .");
	try {
		const res = await axios({
			method: "PATCH",
			url: "/api/users/updateData",
			data
		});

		if (res.data.status === "success") {
			showUserMsg("success", "Información actualizada.");
		}
	} catch (err) {
		let msg = err.response.data.message;
		if (err.response.data.message.includes("duplicate key ")) {
			msg = "El email indicado ya se encuentra registrado.";
		} else {
			msg = msg.split(": ");
			msg = msg[msg.length - 1];
		}
		showUserMsg("error", msg);
	}
};

/*-------------------------------------------------
    - Delete user request -
-------------------------------------------------*/
export const deleteUser = async id => {
	try {
		const res = await axios({
			method: "DELETE",
			url: `/api/users/${id}`
		});
		if (res.data.status === "success") {
			location.assign("/admin/users");
		}
	} catch (err) {}
};

/*-------------------------------------------------
    - Update user password request -
-------------------------------------------------*/
export const updatePassword = async data => {
	showUserMsg("success", ". . .");
	try {
		const res = await axios({
			method: "PATCH",
			url: "/api/users/updatePassword",
			data
		});

		if (res.data.status === "success") {
			showUserMsg2("success", "Contraseña actualizada.");
		}
	} catch (err) {
		document.getElementById("password").value = "";
		document.getElementById("newPassword").value = "";
		document.getElementById("newPasswordConfirm").value = "";

		let msg = err.response.data.message.split(": ");
		msg = msg[msg.length - 1];
		showUserMsg2("error", msg);
	}
};

/*-------------------------------------------------
    - add cart Prod -
-------------------------------------------------*/
export const addCartProd = async data => {
	try {
		const res = await axios({
			method: "PATCH",
			url: "/api/users/addCartProd",
			data
		});
		if (res.data.status === "success") {
			location.assign("/cart");
		}
	} catch (err) {
		location.assign("/login");
	}
};

/*-------------------------------------------------
    - update and delete cart Prod -
-------------------------------------------------*/
export const updateCartProd = async data => {
	try {
		const res = await axios({
			method: "PATCH",
			url: "/api/users/updateCartProd",
			data
		});
		location.assign("/cart");
		// console.log("Cart actualizadp");
	} catch (err) {
		console.log(err);
	}
};

/*-------------------------------------------------
    - Empty cart -
-------------------------------------------------*/
export const emptyCart = async data => {
	try {
		const res = await axios({
			method: "PATCH",
			url: `/api/users/emptyCartProd`
		});
		location.assign("/cart");
	} catch (err) {
		console.log(err);
	}
};
