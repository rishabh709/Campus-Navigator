const optionsBar = document.querySelector("#options")
const optionsList = document.querySelector(".icons")

console.log('chill')
const iconsList = document.querySelectorAll('.options > .icons');
optionsBar.addEventListener("click", ()=>{
    iconsList.forEach(icon => {
        icon.classList.toggle('visible')
    });

})