const loginURL = 'https://www.github.com/login';
const logoutURL = 'https://www.github.com/logout';
const cookieURL = 'https://www.github.com';
const cookieName = 'logged_in';

function onError(error) {
	console.error(`Error: ${error}`);
}

function checkLoginStatus(loginCallback, notLoginCallback) {
	var getCookie = browser.cookies.get({url:cookieURL, name:cookieName});
	getCookie.then(cookie => {
		if (cookie && cookie.value === "yes") {
			loginCallback();
		} else {
			notLoginCallback();
		}
	}).catch(onError);
};



function login(account){
	var copy_account = JSON.parse(JSON.stringify(account));
	var openTab = browser.tabs.create({url: loginURL});
	var executeScript = tab => {
		return new Promise((resolve, reject) => {
			browser.tabs.executeScript(tab.id, {file: "content_scripts/login.js"}).then(a => {
				resolve(tab.id);
			});
		})
	};
	var sendMessage = tab_id => {
		browser.tabs.sendMessage(tab_id, copy_account);
	};
	openTab.then(executeScript).then(sendMessage).catch(onError);
}

function logout() {
	browser.tabs.create({url: logoutURL}).then(tab => {
		browser.tabs.executeScript(tab.id, {file: "content_scripts/logout.js"})
	}).catch(onError);
}
