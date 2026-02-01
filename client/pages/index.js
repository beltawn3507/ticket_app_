import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {

  // LOGGED OUT
  if (!currentUser) {
    return (
      <div className="text-center py-5">

        <h1 className="display-5 fw-bold">
          Buy & Sell Tickets Easily
        </h1>

        <p className="lead text-muted">
          Secure ticket marketplace built for everyone
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link href="/auth/signup" className="btn btn-primary btn-lg">
            Get Started
          </Link>

          <Link href="/auth/signin" className="btn btn-outline-secondary btn-lg">
            Sign In
          </Link>
        </div>

      </div>
    );
  }

  // LOGGED IN
  return (
    <div>

      <h2 className="text-center mb-4 fw-semibold">
        Available Tickets
      </h2>

      <div className="row g-4">

        {tickets.map(ticket => (
          <div key={ticket.id} className="col-md-6 col-lg-4">

            <div className="card border-0 shadow-sm ticket-card h-100">

              <div className="card-body d-flex flex-column">

                <h5 className="fw-semibold mb-2">
                  {ticket.title}
                </h5>

                <p className="text-muted mb-4">
                  ₹ {ticket.price}
                </p>

                <Link
                  href={`/tickets/${ticket.id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Ticket
                </Link>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    return { tickets: [] };
  }

  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
