import Link from "next/link";
import TicketCard from "../components/ticket-card";

const LandingPage = ({ currentUser, tickets }) => {
  const myTickets = currentUser
    ? tickets.filter((ticket) => ticket.userId === currentUser.id)
    : [];
  const marketplaceTickets = currentUser
    ? tickets.filter((ticket) => ticket.userId !== currentUser.id && !ticket.isSold)
    : tickets.filter((ticket) => !ticket.isSold);
  const visibleTickets = currentUser ? [...myTickets, ...marketplaceTickets] : marketplaceTickets;

  return (
    <>
      <section className="surface-card hero-panel">
        <div>
          <div className="hero-panel__eyebrow">Marketplace dashboard</div>
          <h1>Browse live tickets, manage your listings, and move quickly from discovery to checkout.</h1>
          <p>
            This home feed now acts like a proper marketplace. Guests can explore
            active tickets and signed-in users can instantly switch between
            buying, managing their own listings, and checking their orders.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{visibleTickets.length}</strong>
              <span>Visible ticket listings</span>
            </div>
            <div className="hero-stat">
              <strong>{marketplaceTickets.length}</strong>
              <span>Tickets available to buy</span>
            </div>
            <div className="hero-stat">
              <strong>{myTickets.length}</strong>
              <span>Your listings</span>
            </div>
          </div>
        </div>

        <div className="hero-side-panel">
          <h3 className="mb-3">What you can do here</h3>
          <p>
            The client now mirrors the backend more closely, with clear
            separation between public discovery and account-specific actions.
          </p>
          <ul>
            <li>Guests can view ticket prices and jump into auth from the header.</li>
            <li>Signed-in users get My Tickets, My Orders, and Create Ticket in one place.</li>
            <li>You can open any ticket you do not own and start the purchase flow.</li>
          </ul>
        </div>
      </section>

      {!currentUser && (
        <section className="section-head">
          <div>
            <h2>Available tickets</h2>
            <p>Sign in only when you are ready to buy or manage your own listings.</p>
          </div>
          <Link href="/auth/signup" className="btn btn-primary">
            Join marketplace
          </Link>
        </section>
      )}

      {currentUser && (
        <>
          <section className="section-head">
            <div>
              <h2>Tickets you can purchase</h2>
              <p>These listings belong to other users and are ready for checkout.</p>
            </div>
            <Link href="/orders" className="btn btn-outline-secondary">
              View my orders
            </Link>
          </section>

          {marketplaceTickets.length ? (
            <div className="ticket-grid">
              {marketplaceTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  actionLabel="Open listing"
                  actionHref={`/tickets/${ticket.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No tickets from other sellers right now</h3>
              <p className="muted-copy mb-0">
                Your own tickets are available in My Tickets. Check back later for new listings.
              </p>
            </div>
          )}

          <section className="section-head">
            <div>
              <h2>Your latest listings</h2>
              <p>Quick shortcuts into the tickets you created.</p>
            </div>
            <Link href="/my-tickets" className="btn btn-outline-primary">
              Manage my tickets
            </Link>
          </section>

          {myTickets.length ? (
            <div className="ticket-grid">
              {myTickets.slice(0, 3).map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isOwner
                  actionLabel="Manage listing"
                  actionHref={`/tickets/${ticket.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>You have not created any tickets yet</h3>
              <p className="muted-copy">
                Start with your first listing and it will appear in My Tickets.
              </p>
              <Link href="/tickets/new" className="btn btn-primary mt-2">
                Create my first ticket
              </Link>
            </div>
          )}
        </>
      )}

      {!currentUser && (
        <div className="ticket-grid">
          {marketplaceTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              actionLabel="Sign in to purchase"
              actionHref="/auth/signin"
            />
          ))}
        </div>
      )}
    </>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
