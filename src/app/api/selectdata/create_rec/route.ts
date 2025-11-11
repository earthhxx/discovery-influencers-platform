import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";
import { Influencer } from "@/app/model/influencer";

export async function POST(req: Request) {
  try {
    const body: Influencer = await req.json();
    const pool = await getMainConnection();

    const query = `
      INSERT INTO public.raw_people_influencers (
        record_id, record_type, full_name, preferred_name, gender, birth_date,
        email, phone, city, country, occupation, influencer_category,
        primary_platform, followers_count, total_followers_count,
        engagement_rate, engagement_rate_tier, interests, notes,
        secondary_platform, secondary_followers_count, average_monthly_reach,
        collaboration_status, languages, portfolio_url, last_contact_date
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26
      )
      RETURNING *;
    `;

    const values = [
      body.record_id, body.record_type, body.full_name, body.preferred_name,
      body.gender, body.birth_date, body.email, body.phone, body.city, body.country,
      body.occupation, body.influencer_category, body.primary_platform, body.followers_count,
      body.total_followers_count, body.engagement_rate, body.engagement_rate_tier,
      body.interests, body.notes, body.secondary_platform, body.secondary_followers_count,
      body.average_monthly_reach, body.collaboration_status, body.languages,
      body.portfolio_url, body.last_contact_date
    ];

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
