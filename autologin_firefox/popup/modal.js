var modal = {
    showConfirm: function(param, alert=false) {
        var body = document.getElementsByTagName('body')[0];
        var defaluttTitle = '提示';

        var confirmPopup = document.createElement('div');
        confirmPopup.classList.add('modal-background');

        var modalView = document.createElement('div');
        modalView.classList.add('modal-view');
        confirmPopup.appendChild(modalView);

        var modalTitle = document.createElement('div');
        modalTitle.classList.add('modal-title');
        modalTitle.innerText = param.title ? param.title : defaluttTitle;
        modalView.appendChild(modalTitle);

        var modalMessage = document.createElement('div');
        modalMessage.classList.add('modal-msg');
        modalMessage.innerText = param.message;
        modalView.appendChild(modalMessage);

        var modalButtons = document.createElement('div');
        modalButtons.classList.add('modal-buttons');
        modalView.appendChild(modalButtons);

        if (!alert) {
            var cancelButton = document.createElement('button');
            cancelButton.classList.add('normal-button');
            cancelButton.innerText = param.cancelTitle;
            cancelButton.onclick = () => {
                confirmPopup.remove();
                if (typeof(param.cancelClick) === 'function') {
                    param.cancelClick();
                }
            }
            modalButtons.appendChild(cancelButton);
        }

        var confirmButton = document.createElement('button');
        if (alert) {
            confirmButton.classList.add('normal-button');
        } else {
            confirmButton.classList.add('danger-button');
        }
        confirmButton.innerText = param.confirmTitle;
        confirmButton.onclick = () => {
            confirmPopup.remove();
            if (typeof(param.confirmClick) === 'function') {
                param.confirmClick();
            }
        }
        modalButtons.appendChild(confirmButton);

        body.appendChild(confirmPopup);   
    },
    showAlert: function(param) {
        modal.showConfirm(param, true);
    },
}
