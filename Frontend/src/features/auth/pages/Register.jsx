
const Register = () => {
    const handleSubmit=(e)=>{
        e.preventDefault()
    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" placeholder="Enter username" id="username" />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Enter email address" id="email" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter password" />
                </div>
                <button className="button primary-button">Register</button>
            </form>
        </div>
    </main>
  )
}

export default Register