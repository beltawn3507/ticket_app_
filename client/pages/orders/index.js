import Link from "next/link";

const formatStatusClass = (status) => status.replace(":", "-");

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price));

const OrderIndex = ({ currentUser, orders }) => {
  if (!currentUser) {
    return (
      <section className="surface-card form-card mx-auto text-center">
        <div className="hero-panel__eyebrow mx-auto">My Orders</div>
        <h1>Sign in to view your orders</h1>
        <p className="muted-copy mb-0">
          Once you purchase tickets, every order will appear here with its current status.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="surface-card hero-panel">
        <div>
          <div className="hero-panel__eyebrow">My Orders</div>
          <h1>Track every ticket you ordered</h1>
          <p>
            This page is now positioned as your buyer dashboard. Open any order
            to continue payment while the countdown is active.
          </p>
        </div>

        <div className="hero-side-panel">
          <h3 className="mb-3">Order snapshot</h3>
          <ul>
            <li>Total orders: {orders.length}</li>
            <li>Pending payment: {orders.filter((order) => order.status !== "complete").length}</li>
            <li>Completed orders: {orders.filter((order) => order.status === "complete").length}</li>
          </ul>
        </div>
      </section>

      {orders.length ? (
        <div className="status-table">
          <table className="table table-borderless align-middle">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.ticket.title}</strong>
                  </td>
                  <td>{formatPrice(order.ticket.price)}</td>
                  <td>
                    <span className={`status-badge status-badge--${formatStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <Link href={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                      Open order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <h3>You have not placed any orders yet</h3>
          <p className="muted-copy">Browse the marketplace to find your first ticket.</p>
          <Link href="/" className="btn btn-primary mt-2">
            Explore tickets
          </Link>
        </div>
      )}
    </>
  );
};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    return { orders: [] };
  }

  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
