var background = chrome.extension.getBackgroundPage();
var content = document.createElement('div');
content.setAttribute('id', 'accounts');
content.classList.add('container');

background.checkLoginStatus(hasLogedin => {
    if (hasLogedin) {
        setupLoggedinUI();
    } else {
        setupUnloggedinUI();
    }
});

function setupLoggedinUI() {
    var div = document.createElement('div');
    div.classList.add('account');

    var msg = document.createElement('span');
    msg.classList.add('msg');
    msg.innerText = '已登陆';
    div.appendChild(msg);

    var button = document.createElement('button');
    button.classList.add('logout-button');
    button.innerText = '注销';
    button.onclick = () => {
        background.logout();
    }
    div.appendChild(button);
    
    content.appendChild(div);
    document.getElementsByTagName('body')[0].appendChild(content);
}

function setupUnloggedinUI() {
    var addDiv = document.createElement('div');
    addDiv.classList.add('nav', 'vertical-middle-right');
    var addButton = document.createElement('img');
    addButton.classList.add('add-button');
    addButton.setAttribute('alt', '添加');
    addButton.setAttribute('src', chrome.extension.getURL('src/img/add_button.png'));
    addButton.onclick = () => {
        add();
    }
    addDiv.appendChild(addButton);
    content.appendChild(addDiv);

    chrome.storage.local.get(null, results => {
        var keys = Object.keys(results);
        if (keys.length < 1) {
            var blankView = document.createElement('div');
            blankView.setAttribute('class', 'blank-view');
            blankView.innerText = '点击右上角加号添加帐号';
            content.appendChild(blankView);
        }
        for (let i = 0; i < keys.length; i ++) {
            var div = document.createElement('div');
            div.setAttribute('class', 'account');

            var description = document.createElement('div');
            description.setAttribute('class', 'description');
            description.innerText = '账号信息: ' + results[keys[i]].description + '\n' + '账号: ' + results[keys[i]].username;
            div.appendChild(description);

            var loginButton = document.createElement('button');
            loginButton.classList.add('login-button');
            loginButton.innerText = '登陆';
            loginButton.onclick = () => {
                background.login(results[keys[i]]);
            }
            div.appendChild(loginButton);

            
            var moreButton = document.createElement('img');
            moreButton.setAttribute('alt', '更多');
            moreButton.setAttribute('src', chrome.extension.getURL('src/img/more_button.png'));
            moreButton.classList.add('more-button');
            moreButton.onclick = () => {
                edit({[keys[i]]: results[keys[i]]});
            }
            div.appendChild(moreButton); 

            if (i != keys.length - 1) {
                var line = document.createElement('div');
                line.setAttribute('class', 'line');
                div.appendChild(line);
            }

            content.appendChild(div);
        }
        document.getElementsByTagName('body')[0].appendChild(content);
    });

    
}

function edit(account) {
    editOrAdd(account, true);
}

function add() {
    editOrAdd(null, false);
}

function editOrAdd(account, edit) {
    hiddenAccountsPage();

    var editPage = document.createElement('div');
    editPage.setAttribute('id', 'edit');
    editPage.classList.add('container');

    var navBar = document.createElement('div');
    navBar.classList.add('nav');

    var backButton = document.createElement('img');
    backButton.classList.add('back-button');
    backButton.setAttribute('alt', '返回');
    backButton.setAttribute('src', chrome.extension.getURL('src/img/back_button.png'));
    backButton.onclick = () => {
       removeEditPage();
       showAccountsPage();
    }
    navBar.appendChild(backButton);

    var title = document.createElement('span');
    title.innerText = '管理帐号';
    title.classList.add('title');
    navBar.appendChild(title);
    
    editPage.appendChild(navBar);

    var infoArea = document.createElement('div');
    infoArea.classList.add('info');

    var infoDiv = document.createElement('div');
    infoDiv.classList.add('part');
    var infoLabel = document.createElement('label');
    infoLabel.setAttribute('for', 'info');
    infoLabel.classList.add('input-label');
    infoLabel.innerText = '信息';
    var infoInput = document.createElement('textarea');
    infoInput.setAttribute('id', 'info');
    infoInput.classList.add('input-all', 'mul-line-input');
    infoInput.setAttribute('placeholder', '帐号信息');
    if (edit) {
        infoInput.innerText = formatString(getOneValue(account).description);
    }
    infoDiv.appendChild(infoLabel);
    infoDiv.appendChild(infoInput);
    infoArea.appendChild(infoDiv);

    var accountDiv = document.createElement('div');
    accountDiv.classList.add('part');
    var accountLabel = document.createElement('label');
    accountLabel.setAttribute('for', 'username');
    accountLabel.classList.add('input-label');
    accountLabel.innerText = '帐号';
    var accountInput = document.createElement('input');
    accountInput.setAttribute('id', 'username');
    accountInput.setAttribute('type', 'text');
    accountInput.setAttribute('placeholder', '用户名');
    accountInput.classList.add('input-all', 'one-line-input');
    if (edit) {
        accountInput.value = formatString(getOneValue(account).username);
    }
    accountDiv.appendChild(accountLabel);
    accountDiv.appendChild(accountInput);
    infoArea.appendChild(accountDiv);

    var passwordDiv = document.createElement('div');
    passwordDiv.classList.add('part');
    var passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.classList.add('input-label');
    passwordLabel.innerText = '密码';
    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('id', 'password');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('placeholder', '密码');
    passwordInput.classList.add('input-all', 'one-line-input');
    if (edit) {
        passwordInput.value = formatString(getOneValue(account).password);
    }
    passwordDiv.appendChild(passwordLabel);
    passwordDiv.appendChild(passwordInput);
    infoArea.appendChild(passwordDiv);

    editPage.appendChild(infoArea);

    var buttonDiv = document.createElement('div');
    buttonDiv.classList.add('buttons');
    if (edit) {
        var deleteButton = document.createElement('button');
        deleteButton.classList.add('half-button', 'delete-button');
        deleteButton.innerText = '删除';
        deleteButton.onclick = () => {
            deleteStorage(getOneKey(account));
        }
        buttonDiv.appendChild(deleteButton);
    }
    var saveButton = document.createElement('button');
    saveButton.classList.add('save-button');
    if (edit) {
        saveButton.classList.add('half-button');
        saveButton.onclick = () => {
            saveStorage(getOneKey(account));
        }
    } else {
        saveButton.classList.add('full-button');
        saveButton.onclick = () => {
            saveStorage(null);
        }
    }
    saveButton.innerText = '保存';

    
    buttonDiv.appendChild(saveButton);
    editPage.appendChild(buttonDiv);

    document.getElementsByTagName('body')[0].appendChild(editPage);
}

function deleteStorage(storageKey) {
    modal.showConfirm({message: '确定删除吗?',
                       cancelTitle: '取消', 
                       confirmTitle: '确定',
                       confirmClick: () => {
                            chrome.storage.local.remove(storageKey, () => {
                                displayAll();
                            });
                       }
                    });
}

function saveStorage(storageKey) {
    if (isEmpty(document.getElementById('username').value) || 
    isEmpty(document.getElementById('password').value)) {
        modal.showAlert({message: '帐号或密码为空',
                         confirmTitle: '确定',
                        })
    } else {
        let key = isEmpty(storageKey) ? generateKey() : storageKey;
        chrome.storage.local.set({[key]: {
            description: document.getElementById('info').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }}, displayAll)
    }
}

function displayAll() {
    removeEditPage();
    clearAccountsPage();
    showAccountsPage();
    setupUnloggedinUI();
}

function hiddenAccountsPage() {
    document.getElementById('accounts').hidden = true;
}

function showAccountsPage() {
    document.getElementById('accounts').hidden = false;
}

function clearAccountsPage() {
    var accountPage = document.getElementById('accounts');
    while (accountPage.childNodes.length > 0) {
        accountPage.removeChild(accountPage.childNodes[0]);
    }
}

function removeEditPage() {
    document.getElementById('edit').remove();
}

function generateKey() {
    return String(new Date().getTime()) + '-account-key';
}

function getOneValue(d) {
    var keys = Object.keys(d);
    return d[keys[0]];
}

function getOneKey(d) {
    return Object.keys(d)[0];
}

function isEmpty(s) {
    if (s === '' || s === null || typeof(s) === 'undefined') {
        return true;
    }
    return false;
}

function formatString(s) {
    if (isEmpty(s)) {
        return '';
    }
    return s;
}

function showAlert(m) {
    alert(m);
}