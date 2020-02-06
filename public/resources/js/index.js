import "@babel/polyfill";
import * as auth from "./auth";
import * as user from "./user";
import * as order from "./order";
import * as contact from "./contact";
import * as admin from "./admin";

import * as product from "./product";

import { xd } from "./../../vendors/js/xd";

/*-------------------------------------------------
    - Dom elements -
-------------------------------------------------*/

const mobileNav = document.getElementById("nav-icon--js");
/* - Auth - */
const signupForm = document.querySelector(".form__signup--js");
const loginForm = document.querySelector(".form__login--js");
const logout = document.querySelector(".logout--js");

const forgotPassForm = document.querySelector(".form__forgot-pass--js");
const resetPassForm = document.querySelector(".form__reset-pass--js");

/* - Admin - */
const updateBannerForm = document.querySelector(".form__update-banner--js");
const submitToDisable = document.getElementById("submit-to-disable--js");

/* - User - */
const userDataForm = document.querySelector(".form__user-data--js");
const userPasswordForm = document.querySelector(".form__user-password--js");
let deleteUsers = document.getElementsByClassName("user__delete-btn--js");
let searchUserForm = document.querySelector(".form__user-find--js");

/* - Contact - */
const contactForm = document.querySelector(".form__contact--js");
let searchContactForm = document.querySelector(".form__contact-find--js");
let deleteContact = document.getElementsByClassName("contact__delete-btn--js");

/* - Crud Products - */
const createForm = document.querySelector(".form__prod-create--js");
let updateForms = document.getElementsByClassName("form__prod-update--js");
let deleteProduct = document.getElementsByClassName("product__delete-btn--js");
let searchProdForm = document.querySelector(".form__prod-find--js");
let searchFrontProdForm = document.querySelector(".form__front-prod-find--js");

/* - Crud Cart Products - */
const addProdForm = document.getElementById("form__add-product--js");
const addProdQuantity = document.getElementById("prod-quantity--js");

let deleteCartProd = document.getElementsByClassName("cart-prod__delete-btn--js");
let updateCartProd = document.getElementsByClassName("cart-prod__update-btn--js");
let updateCartForm = document.getElementsByClassName("form__cart--js");

const emptyCartBtn = document.getElementById("empty__cart--js");

/* - Order - */
const orderForm = document.querySelector(".form__order--js");
let searchOrdersForm = document.querySelector(".form__orders-find--js");
let updateOrders = document.getElementsByClassName("select__order-update--js");
let deleteOrders = document.getElementsByClassName("order__delete-btn--js");
let cancelMyOrders = document.getElementsByClassName("order__cancel-btn--js");

/* - Navigation -*/
const navButtons = document.getElementsByClassName("nav-button--js");
const paginateLeft = document.getElementById("paginate-left");
const paginateRight = document.getElementById("paginate-right");
const currentPage = document.getElementById("current-page");

const productsSelect = document.querySelector(".products__select--js");

const disableSubmit = () => {
	submitToDisable.disabled = true;
};
/*-------------------------------------------------
    - Evend delegation -
-------------------------------------------------*/

/*-------------------------------------------------
    - Update Banner -
-------------------------------------------------*/
if (updateBannerForm) {
	updateBannerForm.addEventListener("submit", e => {
		e.preventDefault();
		const formData = new FormData();
		const img = document.getElementById("banner_img").files[0];
		if (img) {
			formData.append("img", document.getElementById("banner_img").files[0]);
		}
		admin.updateBanner(formData);
	});
}

/*-------------------------------------------------
    - Signup -
-------------------------------------------------*/
if (signupForm) {
	signupForm.addEventListener("submit", e => {
		e.preventDefault();
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const passwordConfirm = document.getElementById("passwordConfirm").value;
		auth.signup(name, email, password, passwordConfirm);
	});
}

/*-------------------------------------------------
    - Login -
-------------------------------------------------*/
if (loginForm) {
	loginForm.addEventListener("submit", e => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		auth.login(email, password);
	});
}
/*-------------------------------------------------
    - Forgot pass -
-------------------------------------------------*/
if (forgotPassForm) {
	forgotPassForm.addEventListener("submit", e => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		auth.forgotPass(email);
	});
}

/*-------------------------------------------------
    - Reset pass -
-------------------------------------------------*/
if (resetPassForm) {
	resetPassForm.addEventListener("submit", e => {
		e.preventDefault();
		const newPassword = document.getElementById("newPassword").value;
		const newPasswordConfirm = document.getElementById("newPasswordConfirm").value;
		const token = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
		auth.resetPass({ newPassword, newPasswordConfirm, token });
	});
}
/*-------------------------------------------------
    - Logout -
-------------------------------------------------*/
if (logout) logout.addEventListener("click", auth.logout);

/*-------------------------------------------------
    - Update user data -
-------------------------------------------------*/
if (userDataForm) {
	userDataForm.addEventListener("submit", e => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const name = document.getElementById("name").value;
		user.updateData({ name, email });
	});
}

/*-------------------------------------------------
    - Update user password -
-------------------------------------------------*/
if (userPasswordForm) {
	userPasswordForm.addEventListener("submit", e => {
		e.preventDefault();
		const password = document.getElementById("password").value;
		const newPassword = document.getElementById("newPassword").value;
		const newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

		user.updatePassword({
			password,
			newPassword,
			newPasswordConfirm
		});
	});
}

/*-------------------------------------------------
    - Delete User -
-------------------------------------------------*/
if (deleteUsers) {
	Array.from(deleteUsers).forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault();
			user.deleteUser(btn.dataset.id);
		});
	});
}

/*-------------------------------------------------
    - Search from admin Users list -
-------------------------------------------------*/
if (searchUserForm) {
	searchUserForm.addEventListener("submit", e => {
		e.preventDefault();
		const search = document.getElementById(`search`).value;
		window.location.href = `/admin/users?search=${search}`;
	});
}

/*-------------------------------------------------
    - Create Product -
-------------------------------------------------*/
if (createForm) {
	createForm.addEventListener("submit", e => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", document.getElementById("name_create").value);
		formData.append("description", document.getElementById("description_create").value);

		const img = document.getElementById("img_create").files[0];
		if (img) {
			formData.append("img", document.getElementById("img_create").files[0]);
		}
		formData.append("category", document.getElementById("category_create").value);
		formData.append("price", document.getElementById("price_create").value);
		formData.append("discount", document.getElementById("discount_create").value);

		product.createProduct(formData);
	});
}

/*-------------------------------------------------
    - Update Product -
-------------------------------------------------*/
if (updateForms) {
	Array.from(updateForms).forEach(form => {
		form.addEventListener("submit", e => {
			e.preventDefault();

			const formData = new FormData();
			formData.append("name", document.getElementById(`name${form.dataset.form_id}`).value);
			formData.append(
				"description",
				document.getElementById(`description${form.dataset.form_id}`).value
			);

			const img = document.getElementById(`img${form.dataset.form_id}`).files[0];
			if (img) {
				formData.append("img", document.getElementById(`img${form.dataset.form_id}`).files[0]);
			}
			formData.append("category", document.getElementById(`category${form.dataset.form_id}`).value);
			formData.append("price", document.getElementById(`price${form.dataset.form_id}`).value);
			formData.append("discount", document.getElementById(`discount${form.dataset.form_id}`).value);
			product.updateProduct(formData, form.dataset.prod_id);
		});
	});
}

/*-------------------------------------------------
    - Delete Product -
-------------------------------------------------*/
if (deleteProduct) {
	Array.from(deleteProduct).forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault();
			product.deleteProduct(btn.dataset.id);
		});
	});
}

/*-------------------------------------------------
    - Search from admin Products list -
-------------------------------------------------*/
if (searchProdForm) {
	searchProdForm.addEventListener("submit", e => {
		e.preventDefault();
		const search = document.getElementById(`search`).value;
		window.location.href = `/admin/products?search=${search}`;
	});
}

/*-------------------------------------------------
    - Search from admin Orders list -
-------------------------------------------------*/
if (searchOrdersForm) {
	searchOrdersForm.addEventListener("submit", e => {
		e.preventDefault();
		const search = document.getElementById(`search`).value;
		window.location.href = `/admin/orders?search=${search}`;
	});
}

/*-------------------------------------------------
    - Add Product to cart -
-------------------------------------------------*/
if (addProdForm) {
	addProdForm.addEventListener("submit", e => {
		e.preventDefault();
		disableSubmit();
		const quantity = document.getElementById("prod-quantity--js").value;
		const prodId = addProdForm.dataset.prod;
		user.addCartProd({ prodId, quantity });
	});
}

/*-------------------------------------------------
    - Total price per quantity calculation -
-------------------------------------------------*/
if (addProdQuantity) {
	addProdQuantity.addEventListener("change", e => {
		e.preventDefault();
		const quantity = addProdQuantity.value;
		const total = document.getElementById("prod-total--js");
		const price = total.dataset.price;
		total.textContent = `$${+(price * quantity).toFixed(2)}`;
	});
}

/*-------------------------------------------------
    - Delete Cart Product-
-------------------------------------------------*/
if (deleteCartProd) {
	Array.from(deleteCartProd).forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault();
			const prodId = btn.dataset.id;
			const quantity = 0;
			user.updateCartProd({ prodId, quantity });
		});
	});
}

/*-------------------------------------------------
    - Update Cart Product-
-------------------------------------------------*/
// if (updateCartProd) {
// 	Array.from(updateCartProd).forEach(btn => {
// 		btn.addEventListener("click", e => {
// 			e.preventDefault();
// 			const prodId = btn.dataset.id;
// 			const i = btn.dataset.countd;
// 			const quantity = document.getElementById(`prod__quantity${i}--js`).value;
// 			console.log(prodId, i, quantity);
// 			user.updateCartProd({ prodId, quantity });
// 		});
// 	});
// }

if (updateCartForm) {
	Array.from(updateCartForm).forEach(form => {
		form.addEventListener("submit", e => {
			e.preventDefault();
			const prodId = form.dataset.prod_id;
			const i = form.dataset.form_id;
			const quantity = document.getElementById(`prod__quantity${i}--js`).value;
			user.updateCartProd({ prodId, quantity });
		});
	});
}

/*-------------------------------------------------
    - Empty Cart -
-------------------------------------------------*/
if (emptyCartBtn) {
	emptyCartBtn.addEventListener("click", e => {
		e.preventDefault();
		user.emptyCart();
	});
}

/*-------------------------------------------------
    - Create new Contact -
-------------------------------------------------*/
if (contactForm) {
	contactForm.addEventListener("submit", e => {
		e.preventDefault();
		disableSubmit();
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const message = document.getElementById("message").value;
		contact.createContact({ name, email, message });
	});
}

/*-------------------------------------------------
    - Search from admin Contact list -
-------------------------------------------------*/
if (searchContactForm) {
	searchContactForm.addEventListener("submit", e => {
		e.preventDefault();
		const search = document.getElementById(`search`).value;
		window.location.href = `/admin/contacts?search=${search}`;
	});
}

/*-------------------------------------------------
    - Delete Contact -
-------------------------------------------------*/
if (deleteContact) {
	Array.from(deleteContact).forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault();
			contact.deleteContact(btn.dataset.id);
		});
	});
}

/*-------------------------------------------------
    - Create Order -
-------------------------------------------------*/
if (orderForm) {
	orderForm.addEventListener("submit", e => {
		e.preventDefault();
		disableSubmit();
		const recipient = document.getElementById("order__recipient").value;
		const state = document.getElementById("order__state").value;
		const city = document.getElementById("order__city").value;
		const pc = document.getElementById("order__pc").value;
		const sub = document.getElementById("order__sub").value;
		const street = document.getElementById("order__street").value;
		const contact = document.getElementById("order__contact").value;
		const total = orderForm.dataset.total;
		const address = `${sub}, ${street}, ${city}, ${state}, ${pc}`;

		order.createOrder({ recipient, address, contact, total });
	});
}

/*-------------------------------------------------
    - Update Orders -
-------------------------------------------------*/
if (updateOrders) {
	Array.from(updateOrders).forEach(statusSelect => {
		statusSelect.addEventListener("change", e => {
			e.preventDefault();
			const status = statusSelect.options[statusSelect.selectedIndex].value;
			order.updateOrder({ status }, statusSelect.dataset.order_id);
		});
	});
}

/*-------------------------------------------------
    - Delete Orders -
-------------------------------------------------*/
if (deleteOrders) {
	Array.from(deleteOrders).forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault();
			order.deleteOrder(btn.dataset.id);
		});
	});
}

/*-------------------------------------------------
    - Cancel Orders by user -
-------------------------------------------------*/
if (cancelMyOrders) {
	Array.from(cancelMyOrders).forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault();
			order.cancelMyOrder(btn.dataset.id);
		});
	});
}
/*-------------------------------------------------
    - Navigation -
-------------------------------------------------*/
if (navButtons) {
	Array.from(navButtons).forEach(navButton => {
		navButton.addEventListener("click", e => {
			e.preventDefault();
			location.assign(`${navButton.dataset.link}`);
		});
	});
}

/*-------------------------------------------------
    - Search front user products list -
-------------------------------------------------*/

if (mobileNav) {
	mobileNav.addEventListener("click", e => {
		var nav = document.querySelector(".header__main-nav");
		nav.classList.toggle("mobile__nav--js");
	});
}

/*-------------------------------------------------
    - Pagination -
-------------------------------------------------*/

function getURLParameter(name) {
	return (
		decodeURIComponent(
			(new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [
				null,
				""
			])[1].replace(/\+/g, "%20")
		) || null
	);
}

let URL = window.location.href.split("?")[0];
let newURL = URL;
let cat = getURLParameter("cat");
let page = getURLParameter("page");
let sort = getURLParameter("sort");
let search = getURLParameter("search");

if (searchFrontProdForm) {
	searchFrontProdForm.addEventListener("submit", e => {
		e.preventDefault();
		const search = document.getElementById(`search`).value;

		page = "";
		sort = "";
		newURL += `?`;
		if (cat) {
			newURL += `cat=${cat}&`;
		}

		if (search) {
			newURL += `search=${search}`;
		}

		window.location.href = newURL;
	});
}

if (productsSelect) {
	console.log("1");

	if (sort) {
		productsSelect.value = sort;
	}
	productsSelect.addEventListener("change", e => {
		sort = productsSelect.options[productsSelect.selectedIndex].value;
		page = "";

		newURL += `?`;
		if (cat) {
			newURL += `cat=${cat}&`;
		}
		if (search) {
			newURL += `search=${search}&`;
		}

		if (sort) {
			newURL += `sort=${sort}`;
		}
		window.location.href = newURL;
	});
}

if (paginateLeft) {
	if (page == 1 || !page) {
		paginateLeft.disabled = true;
		paginateLeft.classList.add("btn--disabled");
	}
	if (page > 1) {
		paginateLeft.addEventListener("click", () => {
			page--;
			newURL += `?`;
			if (cat) {
				newURL += `cat=${cat}&`;
			}
			if (search) {
				newURL += `search=${search}&`;
			}

			if (sort) {
				newURL += `sort=${sort}&`;
			}
			if (page) {
				newURL += `page=${page}`;
			}
			window.location.href = newURL;
		});
	} else {
		paginateLeft.display = "none";
	}
}

if (paginateRight) {
	if (page > paginateRight.dataset.maxpage - 1 || paginateRight.dataset.maxpage == 1) {
		paginateRight.disabled = true;
		paginateRight.classList.add("btn--disabled");
	}
	paginateRight.addEventListener("click", () => {
		page++;
		if (page === 1) page++;

		newURL += `?`;
		if (cat) {
			newURL += `cat=${cat}&`;
		}
		if (search) {
			newURL += `search=${search}&`;
		}

		if (sort) {
			newURL += `sort=${sort}&`;
		}
		if (page) {
			newURL += `page=${page}`;
		}
		window.location.href = newURL;
	});
}

if (currentPage) {
	if (page) {
		currentPage.innerHTML = `[ ${page} ]`;
	} else {
		currentPage.innerHTML = `[ 1 ]`;
	}
}
