import { useState } from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import ErrorList from "../../../components/error-list";

const TicketEditPage = ({ ticket, currentUser }) => {
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState(String(ticket.price));
  const isOwner = currentUser?.id === ticket.userId;

  const { doRequest, errors } = useRequest({
    url: `/api/tickets/${ticket.id}`,
    method: "put",
    body: { title, price },
    onSuccess: () => Router.push("/my-tickets"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (!Number.isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  if (!currentUser) {
    return (
      <section className="surface-card form-card mx-auto text-center">
        <h1>Sign in to edit tickets</h1>
        <p className="muted-copy mb-0">Editing is available only for authenticated sellers.</p>
      </section>
    );
  }

  return (
    <section className="surface-card form-card mx-auto">
      <div className="form-card__header">
        <div>
          <div className="hero-panel__eyebrow">Edit listing</div>
          <h1>Update your ticket details</h1>
          <p>
            Adjust the title or price for this listing. The backend currently
            supports editing, but ticket deletion will need a new API route.
          </p>
        </div>
      </div>

      {!isOwner && (
        <div className="info-banner">
          This ticket does not belong to your account. Saving will be blocked by the backend.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-3">
        <div className="mb-3">
          <label className="field-label">Ticket title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="form-control form-control-lg"
          />
        </div>

        <div className="mb-3">
          <label className="field-label">Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(event) => setPrice(event.target.value)}
            className="form-control form-control-lg"
          />
        </div>

        <div className="stack-actions mt-4">
          <button className="btn btn-primary" type="submit">
            Save changes
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => Router.push("/my-tickets")}
          >
            Cancel
          </button>
        </div>

        <ErrorList errors={errors} />
      </form>
    </section>
  );
};

TicketEditPage.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketEditPage;
