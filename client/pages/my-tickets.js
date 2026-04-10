import Link from "next/link";
import TicketCard from "../components/ticket-card";

const MyTicketsPage = ({ currentUser, tickets }) => {
  if (!currentUser) {
    return (
      <section className="surface-card form-card mx-auto text-center">
        <div className="hero-panel__eyebrow mx-auto">Seller dashboard</div>
        <h1>Sign in to manage your ticket listings</h1>
        <p className="muted-copy">
          My Tickets is only available after authentication because it is tied to
          the tickets you created.
        </p>
        <div className="stack-actions justify-content-center mt-3">
          <Link href="/auth/signin" className="btn btn-primary">
            Sign in
          </Link>
          <Link href="/auth/signup" className="btn btn-outline-secondary">
            Create account
          </Link>
        </div>
      </section>
    );
  }

  const myTickets = tickets.filter((ticket) => ticket.userId === currentUser.id);

  return (
    <>
      <section className="surface-card hero-panel">
        <div>
          <div className="hero-panel__eyebrow">My Tickets</div>
          <h1>Your seller dashboard</h1>
          <p>
            Review every ticket you created, open any listing for editing, and
            keep pricing tidy without digging through the marketplace feed.
          </p>
        </div>

        <div className="hero-side-panel">
          <h3 className="mb-3">Current status</h3>
          <ul>
            <li>Total listings: {myTickets.length}</li>
            <li>Sold listings remain visible here so you can review completed sales.</li>
            <li>Editing is supported from the UI and backed by the existing update API.</li>
            <li>Delete is not wired yet because the backend does not expose a delete-ticket endpoint.</li>
          </ul>
        </div>
      </section>

      <section className="section-head">
        <div>
          <h2>Manage your listings</h2>
          <p>Open a listing to inspect it or jump straight into edit mode.</p>
        </div>
        <Link href="/tickets/new" className="btn btn-primary">
          Create new ticket
        </Link>
      </section>

      {myTickets.length ? (
        <div className="ticket-grid">
          {myTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isOwner
              actionLabel="Open listing"
              actionHref={`/tickets/${ticket.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No tickets created yet</h3>
          <p className="muted-copy">Your first listing will show up here as soon as you publish it.</p>
          <Link href="/tickets/new" className="btn btn-primary mt-2">
            Create your first ticket
          </Link>
        </div>
      )}
    </>
  );
};

MyTicketsPage.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default MyTicketsPage;
