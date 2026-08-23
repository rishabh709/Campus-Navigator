const optionsBar = document.querySelector("#options");
const optionsList = document.querySelector(".icons");

console.log("chill");
const iconsList = document.querySelectorAll(".options > .icons");
optionsBar.addEventListener("click", () => {
  iconsList.forEach((icon) => {
    icon.classList.toggle("visible");
  });
});

const session = { login: false };

// addEvent = document.querySelector("#addEvent");

// addEvent.addEventListener("click", (e) => {
//   console.log("clicked");
//   if (session.login == false) {
//     window.location.href = "./pages/login.html";
//   }
// });
const contextMenu = document.getElementById("contextMenu");

if (contextMenu) {
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const posX = e.pageX;
        const posY = e.pageY;
        contextMenu.style.position = "absolute";
        contextMenu.style.top = `${posY}px`;
        contextMenu.style.left = `${posX}px`;
        contextMenu.style.display = "block";
    });

    // hide on left click (ignore clicks inside the menu so items can be used)
    document.addEventListener("click", (e) => {
        if (e.button === 0 && !contextMenu.contains(e.target)) {
            contextMenu.style.display = "none";
        }
    });
}
