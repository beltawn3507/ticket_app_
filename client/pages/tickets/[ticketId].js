import Router from "next/router";
import Link from "next/link";
import useRequest from "../../hooks/use-request";
import ErrorList from "../../components/error-list";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price));

const TicketShow = ({ ticket, currentUser }) => {
  const isOwner = currentUser?.id === ticket.userId;
  const isSoldToViewer = ticket.isSold && !isOwner;

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  if (isSoldToViewer) {
    return (
      <section className="surface-card form-card mx-auto text-center">
        <div className="hero-panel__eyebrow mx-auto">Listing unavailable</div>
        <h1>This ticket has already been sold</h1>
        <p className="muted-copy">
          Sold tickets are only visible to the seller. Browse the marketplace for other available listings.
        </p>
        <div className="stack-actions justify-content-center mt-3">
          <Link href="/" className="btn btn-primary">
            Back to marketplace
          </Link>
          {currentUser && (
            <Link href="/orders" className="btn btn-outline-secondary">
              View my orders
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="ticket-detail">
      <article className="surface-card ticket-detail__panel">
        <div className="hero-panel__eyebrow">{isOwner ? "Your ticket" : "Marketplace listing"}</div>
        <h1>{ticket.title}</h1>
        <p className="muted-copy">
          {isOwner
            ? ticket.isSold
              ? "This listing belongs to you and has already been sold. You can still review it from your seller view."
              : "This listing belongs to you. You can update the title or price from the seller controls."
            : "This listing is available for purchase. Open checkout to create an order and continue with payment."}
        </p>

        <div className="ticket-card__meta mt-4">
          <span className={`pill-tag ${isOwner ? "pill-tag--warning" : "pill-tag--success"}`}>
            {isOwner ? (ticket.isSold ? "Seller view - sold" : "Seller view") : "Buyer view"}
          </span>
          <span className="ticket-card__price">{formatPrice(ticket.price)}</span>
        </div>

        <div className="stack-actions mt-4">
          {isOwner ? (
            <>
              {!ticket.isSold && (
                <Link href={`/tickets/${ticket.id}/edit`} className="btn btn-primary">
                  Edit this ticket
                </Link>
              )}
              <Link href="/my-tickets" className="btn btn-outline-secondary">
                Back to my tickets
              </Link>
            </>
          ) : currentUser ? (
            <>
              <button onClick={() => doRequest()} className="btn btn-primary">
                Purchase ticket
              </button>
              <Link href="/orders" className="btn btn-outline-secondary">
                View my orders
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn btn-primary">
                Sign in to purchase
              </Link>
              <Link href="/auth/signup" className="btn btn-outline-secondary">
                Create account
              </Link>
            </>
          )}
        </div>

        <ErrorList errors={errors} />
      </article>

      <aside className="surface-card checkout-panel">
        <h3>What happens next</h3>
        <div className="mt-4 d-grid gap-3">
          <div className="hero-stat">
            <strong>1</strong>
            <span>Open the listing and create an order.</span>
          </div>
          <div className="hero-stat">
            <strong>2</strong>
            <span>Continue through the payment flow from the order page.</span>
          </div>
          <div className="hero-stat">
            <strong>3</strong>
            <span>Track the purchase status later in My Orders.</span>
          </div>
        </div>
      </aside>
    </section>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
