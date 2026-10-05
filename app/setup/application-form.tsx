"use client";

import { useActionState } from "react";
import {
    submitCompanyAccessRequest,
    type SubmitCompanyAccessRequestState,
  } from "@/app/actions/application";



export default function ApplicationForm(){
	const initialState: SubmitCompanyAccessRequestState = { error: null, };

	const [state, formAction, isPending] = useActionState( submitCompanyAccessRequest, initialState, );

	return(<form action={formAction}>
        <label>
          Company name

          {/* name 必须是 companyName，
              因为 Action 使用 formData.get("companyName") 读取它。 */}
          <input
            type="text"
            name="companyName"
            required
            disabled={isPending}
          />
        </label>

        <fieldset disabled={isPending}>
          <legend>Requested products</legend>

          <label>
            {/* 两个 checkbox 使用相同 name="products"。
                Action 用 formData.getAll("products") 收到全部被勾选值。 */}
            <input
              type="checkbox"
              name="products"
              value="chatbot"
            />
            Chatbot
          </label>

          <label>
            <input
              type="checkbox"
              name="products"
              value="voice_agent"
            />
            Voice agent
          </label>
        </fieldset>

        {/* Action 返回 error 时显示；成功时 Action 会 redirect("/setup")。 */}
        {state.error ? (
          <p style={{ color: "crimson" }} role="alert">
            {state.error}
          </p>
        ) : null}

        <button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit request"}
        </button>
      </form>
    );


}