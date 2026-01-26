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
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      
      <div className="spinner-border text-primary mb-3" role="status" />

      <h4>Signing you out...</h4>
      <p className="text-muted">Please wait</p>

    </div>
  );
};

export default Signout;
