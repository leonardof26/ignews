import { NextApiRequest, NextApiResponse } from "next";

import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set(["checkout.session.completed"]);

export default async (req: NextApiRequest, resp: NextApiResponse) => {
  if (req.method !== "POST") {
    resp.setHeader("Allow", "POST");
    return resp.status(405).end("Method not allowed");
  }

  const buf = await buffer(req);

  console.log(buf);

  const secret = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      secret,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return resp.status(400).send(`Webhook error ${err.message}`);
  }

  const { type } = event;

  if (relevantEvents.has(type)) {
    console.log("Evento Recebido", event);
  }

  return resp.json({ received: true });
};
