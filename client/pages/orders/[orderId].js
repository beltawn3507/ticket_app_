import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import ErrorList from "../../components/error-list";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price));

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  const isExpired = timeLeft < 0;

  return (
    <section className="ticket-detail">
      <article className="surface-card ticket-detail__panel">
        <div className="hero-panel__eyebrow">Order checkout</div>
        <h1>{order.ticket.title}</h1>
        <p className="muted-copy">
          Keep this order open while you complete payment. We will refine the
          rest of the order management flow next, but this page already supports checkout clearly.
        </p>

        <div className="ticket-card__meta mt-4">
          <span className={`pill-tag ${isExpired ? "pill-tag--danger" : "pill-tag--warning"}`}>
            {isExpired ? "Order expired" : "Awaiting payment"}
          </span>
          <span className="ticket-card__price">{formatPrice(order.ticket.price)}</span>
        </div>

        <div className="mt-4">
          <div className="checkout-panel__timer">{isExpired ? "Expired" : `${timeLeft}s left`}</div>
          <p className="muted-copy mt-2 mb-0">
            Orders auto-expire if payment is not completed before the countdown finishes.
          </p>
        </div>

        <ErrorList errors={errors} />
      </article>

      <aside className="surface-card checkout-panel">
        <h3 className="mb-3">Complete payment</h3>
        <p className="muted-copy">
          Use the test Stripe checkout to finish the purchase and then return to My Orders.
        </p>

        {isExpired ? (
          <div className="info-banner">
            This order has expired. You can head back to the marketplace and try purchasing again.
          </div>
        ) : (
          <div className="mt-4">
            <StripeCheckout
              token={({ id }) => doRequest({ token: id })}
              stripeKey="pk_test_51SbyPbPAzX5BSsLIZxsp4peEr0Y1LUuuKQkWEzBueRjV0FuZ2HrhaCifkZe43FAenxvOLScmAhZuYQW5pabytbkm00kll2YjDM"
              amount={order.ticket.price * 100}
              email={currentUser.email}
            />
            <button
              type="button"
              className="btn btn-outline-success mt-3"
              onClick={() => doRequest({ token: "tok_visa" })}
            >
              Dev payment success
            </button>
          </div>
        )}

        <div className="stack-actions mt-4">
          <Link href="/orders" className="btn btn-outline-secondary">
            Back to my orders
          </Link>
          <Link href="/" className="btn btn-outline-primary">
            Browse tickets
          </Link>
        </div>
      </aside>
    </section>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
