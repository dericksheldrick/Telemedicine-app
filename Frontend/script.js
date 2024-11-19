document.addEventListener("DOMContentLoaded", () => {
  const Url = "http://localhost:3001";

  function showSection(sectionId) {
    document.querySelectorAll(".section").forEach((section) => {
      section.style.display = section.id === sectionId ? "block" : "none";
    });
    console.log(`Showing section: ${sectionId}`);
  }
  // should display registration form by default
  showSection("register-section");

  // Register new patient
  document
    .getElementById("registration-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${Url}/patients/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        const feedback = document.getElementById("register-feedback");
        feedback.textContent = response.ok
          ? "Registration successful!"
          : result.message;
        feedback.classList.toggle("error", !response.ok);
        if (response.ok) showSection("login-section");
      } catch (error) {
        console.error("Error", error);
      }
    });

  // Log in patient
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${Url}/patients/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });
        const result = await response.json();
        const feedback = document.getElementById("login-feedback");
        feedback.textContent = response.ok
          ? "Login successful!"
          : result.message;
        feedback.classList.toggle("error", !response.ok);
        if (response.ok) showSection("profile-section");
      } catch (error) {
        console.error("Error", error);
      }
    });

  // Fetch patient profile
  async function fetchProfile() {
    try {
      const response = await fetch(`${Url}/patients/profile`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      const profileDetails = document.getElementById("profile-details"); // Corrected typo
      if (response.ok) {
        profileDetails.innerHTML = `
            <p>First Name: ${result.first_name}</p>
            <p>Last Name: ${result.last_name}</p>
            <p>Email: ${result.email}</p>
          `;
      } else {
        profileDetails.innerHTML =
          "<p class='error'>Failed to load profile.</p>";
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  // Book an appointment
  document
    .getElementById("appointment-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${Url}/appointments/book`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });
        const result = await response.json();
        const feedback = document.getElementById("appointment-feedback"); // Corrected typo
        feedback.textContent = response.ok
          ? "Appointment booked successfully!"
          : result.message;
        feedback.classList.toggle("error", !response.ok);
      } catch (error) {
        console.error("Error booking appointment:", error);
      }
    });
});
