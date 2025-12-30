const API = "http://localhost:3000/users";

/* --- Helpers --- */
async function findUserByEmail(email){
  const res = await fetch(`${API}?email=${email}`);
  const data = await res.json();
  return data[0] || null;
}

// Simple demo hash (NOT for production)
function fakeHash(pwd){
  return btoa(pwd);
}

/* --- SIGNUP --- */
document.getElementById("signupBtn")?.addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const roleSelect = document.getElementById("role");
  const role = roleSelect ? roleSelect.value : "user"; // default user

  if(!name || !email || !password){
    return alert("All fields are required");
  }

  const exists = await findUserByEmail(email);
  if(exists){
    return alert("User already exists!");
  }

  const newUser = {
    name,
    email,
    password: fakeHash(password),
    role               // 👈 save role
  };

  await fetch(API, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(newUser)
  });

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
});

/* --- LOGIN --- */
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if(!email || !password){
    return alert("Enter email & password");
  }

  const user = await findUserByEmail(email);
  if(!user){
    return alert("User not found!");
  }

  if(user.password !== fakeHash(password)){
    return alert("Incorrect password!");
  }

  // Save session (only necessary fields)
  localStorage.setItem("user", JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }));

  alert(`Login successful 🎉 Logged in as ${user.role}`);
  if(user.role === "admin"){
  window.location.href = "admin.html";
} else {
  window.location.href = "index.html";
}
});
