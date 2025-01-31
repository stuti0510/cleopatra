document.addEventListener("DOMContentLoaded", function() {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add("animate");
        }, index * 200);
    });
});
