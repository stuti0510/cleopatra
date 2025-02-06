document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".continue-button").addEventListener("click", async () => {
        const email = document.querySelector("input[placeholder='Email']").value;
        const password = document.querySelector("input[placeholder='Password']").value;

        try {
            const response = await fetch("http://localhost:5001/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (data.message === "You signed up with Google. Set a password first.") {
                  // Redirect to set-password.html with email as a query parameter
                  window.location.href = `set-password.html?email=${encodeURIComponent(email)}`;
                } else {
                  alert(data.message); // Show other errors
                }
                return;
              }
          
              // Save token and redirect user to homepage or dashboard
              localStorage.setItem("token", data.token);
              window.location.href = "trial.html";
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });

    document.querySelector(".google-button").addEventListener("click", () => {
        window.location.href = "http://localhost:5001/auth/google";
    });
});
