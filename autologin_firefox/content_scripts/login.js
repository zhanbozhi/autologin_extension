function allReady(callback) {
    let results = [];

    function onReady(fn){
      var readyState = document.readyState;
      if (readyState === 'interactive' || readyState === 'complete') {
          fn();
      } else{
          window.addEventListener("DOMContentLoaded", fn);
      }
    }
    onReady(() => {
      results.push('loaded');
      if (results.length == 2) {
          callback(results);
      }
    });

    browser.runtime.onMessage.addListener(account => {
        results.push(account);
        if (results.length == 2) {
            callback(results);
        }
    });
}

allReady(results => {
    console.log(results);
    var account = typeof(results[0]) === 'object' ? results[0] : results[1];
    var email_input = document.getElementsByName("login");
    var password_input = document.getElementsByName("password");
    if (email_input && password_input && account) {
        email_input[0].value = account.username;
        password_input[0].value = account.password;
        let login_button = document.getElementsByName('commit');
        if (login_button) {
            login_button[0].click();
        }
    }
});