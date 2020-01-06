const loginURL = 'https://www.github.com/login';
const logoutURL = 'https://www.github.com/logout';
const cookieURL = 'https://www.github.com';
const cookieName = 'logged_in';

function checkLoginStatus(callback) {
	var hasLogin = false;
	chrome.cookies.get({url:cookieURL, name:cookieName}, cookie => {
		console.log(cookie);
		if (cookie && cookie.value === "yes") {
			hasLogin = true;
		} else {
			hasLogin = false;
		}
		if (callback) {
			callback(hasLogin);
		}
	});
};

function login(account) {
	openTab(loginURL, tab_id => {
		chrome.tabs.executeScript(tab_id, {file: "content_scripts/login.js"}, () => {
			sendMessageToTab(tab_id, account, response => {

			})
		})
	})
}

function logout() {
	openTab(logoutURL, tab_id => {
		chrome.tabs.executeScript(tab_id, {file: "content_scripts/logout.js"});
	})
}

function openTab(url, callback) {
	chrome.tabs.create({url: url}, tab => {
		if (callback) callback(tab.id)
	});
}

function sendMessageToTab(tab_id, message, callback) {
	chrome.tabs.sendMessage(tab_id, message, response => {
		if(callback) {
			callback(response);
		}
	});
}