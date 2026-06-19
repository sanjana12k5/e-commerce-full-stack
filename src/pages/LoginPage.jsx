export default function LoginPage({ loginEmail, setLoginEmail, handleLogin, navigate }) {
  return (
    <section>
      <div className="card form-card">
        <h2 className="form-title">Sign In</h2>
        <p className="form-subtitle">Log in using your registered email address.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Log In
          </button>
        </form>

        <p className="form-footer-text">
          Don't have an account?{' '}
          <button
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('register')}
          >
            Create one now
          </button>
        </p>
      </div>
    </section>
  );
}
