import Link from "next/link";

const Header = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-2">

      {/* Left - Brand */}
      <Link 
        href="/" 
        className="navbar-brand fw-bold fs-4 text-primary"
      >
        🎟 Ticketing
      </Link>

      {/* Right */}
      <div className="ms-auto d-flex align-items-center gap-3">

        {/* User Email */}
        {currentUser && (
          <div className="d-flex align-items-center gap-2">
            <div 
              className="rounded-circle bg-primary text-white d-flex 
                         align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
            >
              {currentUser.email[0].toUpperCase()}
            </div>

            <span className="text-muted small">
              {currentUser.email}
            </span>
          </div>
        )}

        {/* Auth Buttons */}
        {!currentUser && (
          <>
            <Link 
              href="/auth/signin" 
              className="btn btn-outline-secondary px-4"
            >
              Sign In
            </Link>

            <Link 
              href="/auth/signup" 
              className="btn btn-primary px-4"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* Logged In Buttons */}
        {currentUser && (
          <>
            <Link 
              href="/tickets/new" 
              className="btn btn-primary px-4"
            >
              + Create Ticket
            </Link>

            <Link 
              href="/auth/signout" 
              className="btn btn-outline-danger px-4"
            >
              Sign Out
            </Link>
          </>
        )}

      </div>
    </nav>
  );
};

export default Header;
