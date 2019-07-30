$(function () {
  const ENTER_KEY = 13;
  const COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initializing some page elements
  const $window = $(window);
  const $usernameInput = $('.usernameInput');
  const $messages = $('.messages');
  const $inputMessage = $('.inputMessage');
  const $loginPage = $('.login.page');
  const $chatPage = $('.chat.page');

  const socket = io();

  var username;
  var connected = false;

  $window.keydown(event => {
    if (event.which === ENTER_KEY) {
      if (username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });

  socket.on('login', () => {
    connected = true;
  });

  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  socket.on('user joined', (data) => {
    log(data.username + ' joined');
  });

  socket.on('user left', (data) => {
    log(data.username + ' left');
  });

  function setUsername() {
    username = $usernameInput.val().trim();

    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      socket.emit('add user', username);
    }
  }

  function sendMessage() {
    var message = $inputMessage.val();

    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });

      socket.emit('new message', message);
    }
  }

  function log(message) {
    var $el = $('<li>').addClass('log').text(message);

    addMessageElement($el);
  }

  function addChatMessage(data) {
    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));

    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv);
  }

  function addMessageElement(el) {
    var $el = $(el);

    $messages.append($el);
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  function getUsernameColor(username) {
    var hash = 7;

    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }

    var index = Math.abs(hash % COLORS.length);

    return COLORS[index];
  }
});
