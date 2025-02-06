document.addEventListener("DOMContentLoaded", () => {
    // Get email from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
  
    if (!email) {
      alert("Invalid request. Redirecting to login.");
      window.location.href = "login.html";
    }
  
    document.getElementById("email").value = email;
  
    document.getElementById("set-password-form").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
  
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5001/auth/set-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          alert(data.message);
          return;
        }
  
        alert("Password set successfully! You can now log in.");
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error setting password:", error);
        alert("Something went wrong. Try again.");
      }
    });
  });
  