"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignInPage(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage(null);

    try{
      const{data, error} = await supabase.auth.signInWithPassword({email, password,});

      if(error){
        setErrorMessage(error.message);
        return;
      }

      console.log("logging success", data.user);
    }finally{
      setSubmitting(false);
    }

    router.push("/dashboard");
    router.refresh();
    }









  return (
    <div>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" disabled = {submitting}>
          {submitting ? "signing in.." : "Sign in"}
         
        </button>

        {errorMessage ? (
            <p style={{ color: "crimson", margin: 0 }}>{errorMessage}</p>
          ) : null}
      </form>
    </div>
  );
}
