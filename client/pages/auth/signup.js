import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Link from "next/link";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">

      <div
        className="card border-0 shadow-lg p-4"
        style={{ width: "420px", borderRadius: "14px" }}
      >

        {/* Brand */}
        <h1 className="text-center fw-bold mb-1 text-primary">
          🎟 Ticketing
        </h1>

        <p className="text-center text-muted mb-4">
          Create your account
        </p>

        <form onSubmit={onSubmit}>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label small text-muted">
              Email
            </label>

            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label small text-muted">
              Password
            </label>

            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Errors */}
          {errors && (
            <div className="alert alert-danger py-2">
              {errors}
            </div>
          )}

          {/* Button */}
          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 mb-0 text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-decoration-none fw-semibold"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
