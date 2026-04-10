import Link from "next/link";

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

const TicketCard = ({ ticket, isOwner = false, actionLabel = "View details", actionHref }) => {
  const isSold = Boolean(ticket.isSold);
  const statusLabel = isOwner ? (isSold ? "Sold" : "Your listing") : "Available now";
  const ownerCopy = isSold
    ? "This ticket has already been sold. You can still review the listing details here."
    : "Manage pricing and details from your seller view.";

  return (
    <article className="ticket-card">
      <div className="ticket-card__meta">
        <span className={`pill-tag ${isOwner ? "pill-tag--warning" : "pill-tag--success"}`}>
          {statusLabel}
        </span>
        <span className="ticket-card__price">{formatPrice(ticket.price)}</span>
      </div>

      <div>
        <h3 className="mb-2">{ticket.title}</h3>
        <p className="ticket-card__owner mb-0">
          {isOwner ? ownerCopy : "Open the ticket to purchase or review the listing."}
        </p>
      </div>

      <div className="ticket-card__actions">
        <Link href={actionHref} className="btn btn-primary">
          {actionLabel}
        </Link>
        {isOwner && !isSold && (
          <Link href={`/tickets/${ticket.id}/edit`} className="btn btn-outline-secondary">
            Edit ticket
          </Link>
        )}
      </div>
    </article>
  );
};

export default TicketCard;
