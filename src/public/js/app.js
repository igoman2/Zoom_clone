// 자동으로 socket.io를 실행하고 있는 서버를 찾음
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const nickname = welcome.querySelector("#name");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value, showRoom);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  // const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  // nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // 1. wss은 string만 보낼 수 있었지만 socket.io는 object를 보낼 수 있음
  // 2. wss은 message 이벤트만 보낼 수 있었지만 socket.io는 여러 이벤트 생성 가능
  // 3. emit의 3번째 인자는 콜백. 반드시 마지막 아규먼트가 function 이어야 함
  socket.emit("enter_room", input.value);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
nickname.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left ㅠㅠ`);
});

// = socket.on("new_message", (msg) => { addMessage(msg) })
socket.on("new_message", addMessage);
