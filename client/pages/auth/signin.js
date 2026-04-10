import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import ErrorList from "../../components/error-list";
import AuthLayout from "../../components/auth-layout";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <AuthLayout
      mode="signin"
      title="Sign in to manage tickets and orders"
      subtitle="Jump back into your dashboard to monitor listings, place orders, and keep checkout moving."
    >
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="field-label">Email address</label>
          <input
            type="email"
            className="form-control form-control-lg"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="field-label">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary btn-lg w-100 mt-3" type="submit">
          Sign in
        </button>

        <ErrorList errors={errors} />
      </form>

      <p className="mt-4 mb-0 muted-copy">
        Need an account?{" "}
        <Link href="/auth/signup" className="fw-semibold text-primary">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signin;
