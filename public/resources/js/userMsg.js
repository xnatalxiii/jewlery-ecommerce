export const hideUserMsg = () => {
	const el = document.querySelector(".user-msg");
	if (el) el.parentElement.removeChild(el);
	const el2 = document.querySelector(".user-msg-2");
	if (el2) el2.parentElement.removeChild(el2);
};

export const showUserMsg = (type, msg) => {
	hideUserMsg();
	const markup = `<div class="user-msg user-msg--${type}">${msg}</div>`;
	document.querySelector(".user-msg__container").insertAdjacentHTML("afterend", markup);
	// window.setTimeout(hideUserMsg, 5000);
};

export const showUserMsg2 = (type, msg) => {
	hideUserMsg();
	const markup = `<div class="user-msg-2 user-msg--${type}">${msg}</div>`;
	document.querySelector(".user-msg-2__container").insertAdjacentHTML("afterend", markup);
	// window.setTimeout(hideUserMsg, 5000);
};
