document.addEventListener("DOMContentLoaded", () => {
document.querySelector(".continue-button").addEventListener("click", async () => {
    const email = document.querySelector("input[placeholder='Email']").value;
    const username = document.querySelector("input[placeholder='User Name']").value;
    const password = document.querySelector("input[placeholder='Password']").value;
    const birthday = document.querySelector("input[placeholder='dd-mm-yyyy']").value;

    try {
        const response = await fetch("http://localhost:5001/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password, birthday })
        });

        const data = await response.json();
        alert(data.message);
        window.location.href = "trial.html";

    } catch (error) {
        console.error("Error:", error);
        }
    });
    
    document.querySelector(".google-button").addEventListener("click",()=>{
        window.location.href="http://localhost:5001/auth/google";
    });   
});

  