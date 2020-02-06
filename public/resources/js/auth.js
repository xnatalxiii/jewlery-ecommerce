import axios from "axios";
import { showUserMsg } from "./userMsg";

/*-------------------------------------------------
	- Signup request -
-------------------------------------------------*/
export const signup = async (name, email, password, passwordConfirm) => {
	showUserMsg("success", ". . .");
	try {
		const res = await axios({
			method: "POST",
			url: "/api/users/signup",
			data: {
				name,
				email,
				password,
				passwordConfirm
			}
		});
		if (res.data.status === "success") {
			location.assign("./");
		}
	} catch (err) {
		document.getElementById("password").value = "";
		document.getElementById("passwordConfirm").value = "";
		let msg = err.response.data.message.split(": ");
		msg = msg[msg.length - 1];
		showUserMsg("error", msg);
	}
};

/*-------------------------------------------------
    - Login request -
-------------------------------------------------*/
export const login = async (email, password) => {
	showUserMsg("success", ". . .");
	try {
		const res = await axios({
			method: "POST",
			url: "/api/users/login",
			data: {
				email,
				password
			}
		});
		if (res.data.status === "success") {
			location.assign("./");
		}
	} catch (err) {
		document.getElementById("password").value = "";
		showUserMsg("error", "Usuario o contraseña incorrectos.");
	}
};

/*-------------------------------------------------
    - forgot password request -
-------------------------------------------------*/
export const forgotPass = async email => {
	showUserMsg("success", ". . .");
	try {
		const res = await axios({
			method: "POST",
			url: "/api/users/forgotPassword",
			data: {
				email
			}
		});
		if (res.data.status === "success") {
			showUserMsg("success", "Correo enviado.");
		}
	} catch (err) {
		showUserMsg("error", "Correo inválido.");
	}
};

/*-------------------------------------------------
    - reset password request -
-------------------------------------------------*/
export const resetPass = async data => {
	showUserMsg("success", ". . .");
	try {
		const res = await axios({
			method: "PATCH",
			url: `/api/users/resetPassword/${data.token}`,
			data: {
				password: data.newPassword,
				passwordConfirm: data.newPasswordConfirm
			}
		});
		if (res.data.status === "success") {
			location.assign("/account");
		}
	} catch (err) {
		document.getElementById("newPassword").value = "";
		document.getElementById("newPasswordConfirm").value = "";

		let msg = err.response.data.message.split(": ");
		msg = msg[msg.length - 1];
		showUserMsg("error", msg);
	}
};

/*-------------------------------------------------
    - Logout request -
-------------------------------------------------*/
export const logout = async () => {
	try {
		const res = await axios({
			method: "GET",
			url: "/api/users/logout"
		});
		if (res.data.status === "success") {
			location.assign("./");
		}
	} catch (err) {}
};
