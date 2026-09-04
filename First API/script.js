const loadUsersBtn = document.getElementById("loadUsersBtn");
const usersContainer = document.getElementById("users");
const status = document.getElementById("status");

    loadUsersBtn.addEventListener("click", loadUsers);

async function loadUsers() {
  // Clear previous users and errors
  usersContainer.innerHTML = "";
  status.classList.remove("error");

  // Show loading message
  status.textContent = "Loading...";

  // Disable button while loading
  loadUsersBtn.disabled = true;

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    // Check if request was successful
    if (!response.ok) {
      throw new Error(
        `Failed to load users. Status: ${response.status}`
      );
    }

    // Convert response to JSON
    const users = await response.json();

    // Remove loading message
    status.textContent = "";

    // Display users
    users.forEach((user) => {
      const userCard = document.createElement("div");

      userCard.classList.add("user-card");

      userCard.innerHTML = `
        <h2>${user.name}</h2>

        <p>
          <strong>Username:</strong>
          ${user.username}
        </p>

        <p>
          <strong>Email:</strong>
          ${user.email}
        </p>

        <p>
          <strong>Phone:</strong>
          ${user.phone}
        </p>

        <p>
          <strong>Company:</strong>
          ${user.company.name}
        </p>
      `;

      usersContainer.appendChild(userCard);
    });

  } catch (error) {
    status.textContent =
      "Error: Unable to retrieve users. Please try again.";

    status.classList.add("error");

    console.error("Fetch error:", error);

  } finally {
    // Enable button again
    loadUsersBtn.disabled = false;
  }
}