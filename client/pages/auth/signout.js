import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">

      <div
        className="card border-0 shadow-lg p-4 text-center"
        style={{ width: "420px", borderRadius: "14px" }}
      >

        {/* Brand */}
        <h1 className="fw-bold text-primary mb-2">
          🎟 Ticketing
        </h1>

        {/* Spinner */}
        <div
          className="spinner-border text-primary my-4"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        />

        <h4 className="fw-semibold">Signing you out</h4>

        <p className="text-muted mb-0">
          Securely ending your session...
        </p>

      </div>
    </div>
  );
};

export default Signout;
