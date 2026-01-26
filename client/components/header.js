import Link from "next/link";

const Header = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light px-4">
      
      {/* Logo */}
      <Link href="/" className="navbar-brand">
        Ticketing
      </Link>

      {/* Right Side */}
      <div className="d-flex align-items-center gap-3">

        {currentUser && (
          <span className="text-muted">
            {currentUser.email}
          </span>
        )}

        {!currentUser && (
          <>
            <Link href="/auth/signup" className="btn btn-outline-primary">
              Sign Up
            </Link>

            <Link href="/auth/signin" className="btn btn-primary">
              Sign In
            </Link>
          </>
        )}

        {currentUser && (
          <>
            <Link href="/tickets/new" className="btn btn-success">
              Create Ticket
            </Link>

            <Link href="/auth/signout" className="btn btn-outline-danger">
              Sign Out
            </Link>
          </>
        )}

      </div>
    </nav>
  );
};

export default Header;
