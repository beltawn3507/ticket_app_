import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {

  // If NOT logged in
  if (!currentUser) {
    return (
      <div className="text-center mt-5">
        <h1 className="display-4">Welcome to Ticketing</h1>
        <p className="lead">Buy and sell tickets easily</p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link href="/auth/signup" className="btn btn-primary btn-lg">
            Sign Up
          </Link>

          <Link href="/auth/signin" className="btn btn-outline-primary btn-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // If logged in → show tickets
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`} className="btn btn-sm btn-info">
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2 className="text-center my-4">Available Tickets</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>

        <tbody>{ticketList}</tbody>
      </table>
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
