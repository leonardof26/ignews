import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { query as q } from "faunadb";

import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_costumer_id?: string;
  };
};

export default async (req: NextApiRequest, resp: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let custumerId = user.data.stripe_costumer_id;

    if (!custumerId) {
      const stripeCostumer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: { stripe_costumer_id: stripeCostumer.id },
        })
      );

      custumerId = stripeCostumer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: custumerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1IheX3Evf9T3VZCXSppPtdF5", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return resp.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    resp.setHeader("Allow", "POST");
    resp.status(405).end("Method not allowed");
  }
};
