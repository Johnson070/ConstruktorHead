var WebApp = window.Telegram.WebApp;
var MainButton = WebApp.MainButton;
MainButton.show();
WebApp.expand();
WebApp.enableClosingConfirmation();

MainButton.onClick(function() {
  WebApp.showAlert("Хорошо, ты нажал на главную кнопку.");
});
WebApp.onEvent('mainButtonClicked', function() {
  /* also */
});
