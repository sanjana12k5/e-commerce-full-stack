export default function RegisterPage({ registerForm, setRegisterForm, handleRegister, navigate }) {
  return (
    <section>
      <div className="card form-card">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Register to make purchases and track shipments.</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="9876543210"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shipping Location Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="123 Main St, Apt 4B, New York, NY"
              value={registerForm.address}
              onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
            Sign Up
          </button>
        </form>

        <p className="form-footer-text">
          Already have an account?{' '}
          <button
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('login')}
          >
            Log In
          </button>
        </p>
      </div>
    </section>
  );
}
