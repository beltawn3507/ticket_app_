const AuthLayout = ({ title, subtitle, children, mode }) => {
  const isSignup = mode === "signup";

  return (
    <section className="auth-shell">
      <div className="auth-showcase">
        <div className="hero-panel__eyebrow">
          {isSignup ? "Start selling in minutes" : "Pick up where you left off"}
        </div>
        <h1>{isSignup ? "Build your ticket storefront and reach buyers faster." : "Welcome back to your live ticket marketplace."}</h1>
        <p>
          Browse fresh listings, manage your own events, and keep track of every
          order from one clean dashboard.
        </p>

        <ul className="auth-benefits">
          <li>Discover tickets from the home feed without digging through clutter.</li>
          <li>Keep your own listings organized inside My Tickets.</li>
          <li>Review every purchase from My Orders after you sign in.</li>
        </ul>
      </div>

      <div className="surface-card auth-card">
        <div className="hero-panel__eyebrow">{isSignup ? "Create account" : "Sign in"}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
