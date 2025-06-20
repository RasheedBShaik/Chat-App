// Elements
const contactNameDisplay = document.getElementById("contactName");
const contactImage = document.getElementById("contactImage");
const conversation = document.querySelector(".conversation");
const sendBtn = document.getElementById("sendBtn");
const messageText = document.getElementById("messageText");
const backBtn = document.getElementById("backBtn");
const navbar = document.querySelector(".navbar");
const chat = document.querySelector(".chat");
const threeDots = document.querySelector(".three-dots");
const menu = document.querySelector(".menu");
const toggleCheckbox = document.getElementById("mode-toggle");
const sunIcon = document.querySelector(".sun");
const moonIcon = document.querySelector(".moon");
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const noResult = document.getElementById("noResult");

// Function to load chat for selected contact
function loadChat(contact) {
  const name = contact.getAttribute("data-name");
  const imgSrc = contact.getAttribute("data-img");

  contactNameDisplay.textContent = name;
  contactImage.src = imgSrc;
  contactImage.alt = `${name}`;

  // Clear conversation and load dummy messages
  conversation.innerHTML = "";
  const message1 = document.createElement("div");
  message1.className = "message received";
  message1.textContent = `Hi! This is ${name}.`;

  const message2 = document.createElement("div");
  message2.className = "message sent";
  message2.textContent = "Type something to start conversation.";

  conversation.appendChild(message1);
  conversation.appendChild(message2);
  conversation.scrollTop = conversation.scrollHeight;

  // On mobile: hide contacts, show chat
  if (window.innerWidth <= 768) {
    navbar.classList.add("hidden");
    chat.classList.add("active");
  }

  if (navbar.classList.contains("active")) {
    header.style.display = "flex";
  }
  if (chat.classList.contains("active")) {
    header.style.display = "none";
  }
}

// Attach click listeners to contacts
document.getElementById("contactList").addEventListener("click", function (e) {
  const contact = e.target.closest(".contact");
  if (contact) {
    loadChat(contact);
  }
});

// Send message function
function sendMessage() {
  const text = messageText.value.trim();
  if (text !== "") {
    const message = document.createElement("div");
    message.className = "message sent";
    message.textContent = text;
    conversation.appendChild(message);
    conversation.scrollTop = conversation.scrollHeight;
    messageText.value = "";

    setTimeout(() => {
      const reply = document.createElement("div");
      reply.className = "message received";
      reply.textContent = "Got your message!";
      conversation.appendChild(reply);
      conversation.scrollTop = conversation.scrollHeight;
    }, 0);
  }
}

// Send message on button click
sendBtn.addEventListener("click", sendMessage);

// Send message on Enter key press (prevent newline)
messageText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Back button: show contacts, hide chat on mobile
backBtn.addEventListener("click", () => {
  navbar.classList.remove("hidden");
  chat.classList.remove("active");
  header.style.display = "flex";
});

// Toggle 3-dot menu visibility
threeDots.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("hidden");
});

// Click outside menu closes it
document.addEventListener("click", () => {
  menu.classList.add("hidden");
});

// Search contact
function searchContacts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const contacts = document.querySelectorAll("#contactList .contact");
  const noResult = document.getElementById("noResult");

  let matchFound = false;

  contacts.forEach((contact) => {
    const nameDiv = contact.querySelector("div");
    const originalName =
      nameDiv.getAttribute("data-original") || nameDiv.textContent;
    const lowerName = originalName.toLowerCase();

    if (lowerName.includes(input)) {
      const start = lowerName.indexOf(input);
      const end = start + input.length;

      const highlightedName =
        originalName.substring(0, start) +
        `<span style="color:red;font-weight:600;">${originalName.substring(
          start,
          end,
        )}</span>` +
        originalName.substring(end);

      nameDiv.setAttribute("data-original", originalName);
      nameDiv.innerHTML = highlightedName;

      contact.style.display = "flex";
      matchFound = true;
    } else {
      if (nameDiv.hasAttribute("data-original")) {
        nameDiv.textContent = nameDiv.getAttribute("data-original");
        nameDiv.removeAttribute("data-original");
      }

      contact.style.display = "none";
    }
  });

  noResult.style.display = matchFound ? "none" : "flex";
}

// Create new contact
function createContact() {
  const name = window.prompt("Enter Contact Name:");
  if (!name) return;

  const newContact = document.createElement("div");
  newContact.className = "contact";
  // Add theme class based on current toggle state:
  newContact.classList.add(toggleCheckbox.checked ? "moon" : "sun");

  newContact.setAttribute("data-name", name);
  newContact.setAttribute("data-img", "./images/Avatar.png"); // fallback image

  const logoDiv = document.createElement("p");
  logoDiv.className = "logo";

  // Create initials
  const parts = name.trim().split(/\s+/);
  let initials = "";
  if (parts.length === 1) {
    initials = parts[0][0].toUpperCase();
  } else {
    initials = parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  }

  logoDiv.textContent = initials;

  const nameDiv = document.createElement("div");
  nameDiv.textContent = name;

  newContact.appendChild(logoDiv);
  newContact.appendChild(nameDiv);

  const contactList = document.getElementById("contactList");
  contactList.appendChild(newContact);
}

// Dark/Light mode toggle
toggleCheckbox.addEventListener("change", () => {
  // 🔄 Always get updated list of contacts
  const updatedContacts = document.querySelectorAll(".contact");

  updatedContacts.forEach((contact) => {
    contact.classList.remove("sun", "moon");
    contact.classList.add(toggleCheckbox.checked ? "moon" : "sun");
  });

  navbar.style.backgroundColor = toggleCheckbox.checked ? "#333" : "#b6ffce";
  header.style.backgroundColor = toggleCheckbox.checked ? "black" : "#8a8adf";

  footer.style.backgroundColor = toggleCheckbox.checked ? "black" : "#8a8adf";
  sendBtn.style.backgroundColor = toggleCheckbox.checked ? "#333" : "#8a8adf";
  noResult.style.color = toggleCheckbox.checked ? "white" : "#333";
});
