fetch("http://localhost:3003/api/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@seedabit.com.br", password: "senha123" })
})
.then(res => res.json())
.then(data => console.log("Success:", data))
.catch(err => console.error("Error:", err.message));
