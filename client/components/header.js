import Link from "next/link";

const Header = ({ currentUser }) => {
  const isSignedIn = Boolean(currentUser);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark__badge">T</span>
          <span>
            <strong>TicketHub</strong>
            <small>Live marketplace</small>
          </span>
        </Link>

        <nav className="nav-links">
          <Link href="/" className="nav-link-chip">
            Explore Tickets
          </Link>

          {!isSignedIn && (
            <>
              <Link href="/auth/signin" className="nav-link-chip">
                Login
              </Link>
              <Link href="/auth/signup" className="nav-link-chip nav-link-chip--primary">
                Sign Up
              </Link>
            </>
          )}

          {isSignedIn && (
            <>
              <Link href="/my-tickets" className="nav-link-chip">
                My Tickets
              </Link>
              <Link href="/orders" className="nav-link-chip">
                My Orders
              </Link>
              <Link href="/tickets/new" className="nav-link-chip nav-link-chip--primary">
                Create Ticket
              </Link>
              <Link href="/auth/signout" className="nav-link-chip nav-link-chip--danger">
                Sign Out
              </Link>
            </>
          )}
        </nav>

        {isSignedIn && (
          <div className="user-pill">
            <span className="user-pill__avatar">
              {currentUser.email[0].toUpperCase()}
            </span>
            <div>
              <small>Signed in as</small>
              <strong>{currentUser.email}</strong>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
