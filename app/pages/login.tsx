import Login from "app/login/page"

export default function LoginPage() {
  const handleLogin = (credentials) => {
    // Handle login logic
    console.log('Login attempt:', credentials)
    // Redirect on success
  }

  return <Login onLogin={handleLogin} />
}