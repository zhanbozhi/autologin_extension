function onReady(fn){
    var readyState = document.readyState;
    if (readyState === 'complete' || readyState === 'interactive') {
        fn();
    } else{
        window.addEventListener("DOMContentLoaded", fn);
    }
}

onReady(() => {
    var logoutButton =  document.getElementsByClassName('btn btn-block');
    if (logoutButton) {
        logoutButton[0].click();
    }
})