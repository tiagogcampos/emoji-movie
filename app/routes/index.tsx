import { Form, useActionData, useTransition } from "@remix-run/react";
import { openAI, generatePrompt } from "~/utils/openai";
import { CreateCompletionResponseChoices } from "openai";
import type { ActionFunction } from "@remix-run/node";

import styles from '~/styles/index.css';
import { useRef } from "react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const message = formData.get("message") || "";

  if (!message) return;
  const prompt = generatePrompt(message.toString());

  const response = await openAI.createCompletion("text-davinci-002", {
    prompt,
    max_tokens: 35,
    temperature: 0.5,
  })
  const choices = response.data?.choices || []
  return {
    choices
  }

}

type ActionData = {
  choices: CreateCompletionResponseChoices[];
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  const { choices } = useActionData<ActionData>() || { choices: [] };
  const state = useTransition();
  const submitting = Boolean(state.submission);
  return (
    <div className="main" >
      <h1 style={{ margin: "50px" }}>Emoji Movie Predictor 😎</h1>
      {choices.length > 0 ? <div>
        {choices.map(choice =>
          <h2 className="prediction" key={choice.index}>{choice.text}</h2>
        )}
      </div> : <div>&nbsp;</div>}

      <Form method="post" className="form-data">
        <input className="input" name="message" type="text" required autoFocus placeholder="win + '.' to select emojis" />
        <br />
        <button className="submit-button" type="submit">{submitting ? "Predicting..." : "Predict Movie!"}</button>
      </Form>
    </div >
  );
}
