import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import ErrorList from "../../components/error-list";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/my-tickets"),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (Number.isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <section className="surface-card form-card mx-auto">
      <div className="form-card__header">
        <div>
          <div className="hero-panel__eyebrow">New listing</div>
          <h1>Create a ticket people will want to buy</h1>
          <p>
            Add a clear title and your asking price. Once published, the ticket
            appears on the marketplace and inside My Tickets.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="field-label">Ticket title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="form-control form-control-lg"
            placeholder="Concert VIP Pass"
          />
        </div>

        <div className="mb-3">
          <label className="field-label">Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(event) => setPrice(event.target.value)}
            className="form-control form-control-lg"
            placeholder="2499.00"
          />
        </div>

        <div className="stack-actions mt-4">
          <button className="btn btn-primary" type="submit">
            Publish ticket
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => Router.push("/my-tickets")}
          >
            Back to my tickets
          </button>
        </div>

        <ErrorList errors={errors} />
      </form>
    </section>
  );
};

export default NewTicket;
