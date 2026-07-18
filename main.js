const target = document.querySelector("#target");

target.addEventListener("targetFound", () => {
    console.log("FOUND");
});

target.addEventListener("targetLost", () => {
    console.log("LOST");
});