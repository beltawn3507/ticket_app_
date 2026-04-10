import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const Signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <section className="surface-card form-card mx-auto text-center">
      <div className="hero-panel__eyebrow mx-auto">Signing out</div>
      <h1>Ending your session securely</h1>
      <p className="muted-copy mb-4">
        We are clearing your session and taking you back to the marketplace.
      </p>
      <div className="spinner-border text-primary" role="status" />
    </section>
  );
};

export default Signout;
