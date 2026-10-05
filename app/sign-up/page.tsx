"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";



export default function SignUpPage(){
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

	const supabase = createClient();

	const router = useRouter();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
		event.preventDefault();

		setSubmitting(true);
		setErrorMessage(null);
		setNoticeMessage(null);

		try{
			const{data, error} = await supabase.auth.signUp({
				email,
				password,
			});
		if(error){
			setErrorMessage(error.message);
			return;
		}

		if(!data.session){
			setNoticeMessage("Account created. Check your email to verify your account, then sign in to continue your access request.",);
			return;
		}

		router.push("/dashboard");
		router.refresh();
		}finally {
			setSubmitting(false);
		}
	}
	return (
      <main style={{ padding: 24, maxWidth: 420 }}>
        <h1>Create account</h1>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              required
            />
          </label>

          {errorMessage ? (
            <p style={{ color: "crimson", margin: 0 }} role="alert">
              {errorMessage}
            </p>
          ) : null}

          {noticeMessage ? (
            <p style={{ color: "seagreen", margin: 0 }}>
              {noticeMessage}
            </p>
          ) : null}

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p>
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </main>
    );
}
