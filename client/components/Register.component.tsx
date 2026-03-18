import React from "react";
import { fetchMethod } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { ReactFormState } from "react-dom/client";

type Person = { email: string; password: string; name: string | " " };

function Register({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function storeUser(event: React.SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const payload = {
        name: userName.trim() || null,
        email: email.trim(),
        password: password.trim(),
      };

      const newUser = await fetchMethod.fetching("/api/auth/register", {
        method: "POST",

        body: JSON.stringify(payload),
      });
      if (newUser.token) {
        setSuccess("Account Created!");
        console.log(newUser.name, "is in!!!");
        
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("failed to register account!!!");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;
  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="false"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/40"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-neutral-primary-soft border border-default rounded-2xl shadow-sm p-4 md:p-6 bg-gray-100">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5  bg-gray-100">
            <h3 className="text-lg font-medium text-heading">Create Account</h3>
            <button
              type="button"
              className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
              data-modal-hide="authentication-modal"
              onClick={onClose}
            >
              X
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <form onSubmit={storeUser} className="pt-4 md:pt-6">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                placeholder="John Smith"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                placeholder="example@company.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                placeholder="•••••••••"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={busy}
              className="text-white bg-black rounded px-4 py-2.5 w-full"
            >
              {busy ? "Creating..." : "Register Account"}
            </button>
            {success && (
              <div style={{ color: "green", marginTop: "10px" }}>{success}</div>
            )}

            {/* <div className="text-sm font-medium text-body">Not registered? <a href="#" className="text-fg-brand hover:underline">Create account</a></div> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
