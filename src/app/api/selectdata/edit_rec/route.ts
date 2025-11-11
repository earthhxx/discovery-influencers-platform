import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";
import { Influencer } from "@/app/model/influencer";

export async function PATCH(req: Request) {
  try {
    const body: Influencer = await req.json();
    if (!body.record_id) {
      return NextResponse.json({ error: "record_id is required" }, { status: 400 });
    }

    const pool = await getMainConnection();

    const query = `
      UPDATE public.raw_people_influencers
      SET
        record_type = $1, full_name = $2, preferred_name = $3, gender = $4,
        birth_date = $5, email = $6, phone = $7, city = $8, country = $9,
        occupation = $10, influencer_category = $11, primary_platform = $12,
        followers_count = $13, total_followers_count = $14, engagement_rate = $15,
        engagement_rate_tier = $16, interests = $17, notes = $18,
        secondary_platform = $19, secondary_followers_count = $20,
        average_monthly_reach = $21, collaboration_status = $22,
        languages = $23, portfolio_url = $24, last_contact_date = $25
      WHERE record_id = $26
      RETURNING *;
    `;

    const values = [
      body.record_type, body.full_name, body.preferred_name, body.gender,
      body.birth_date, body.email, body.phone, body.city, body.country,
      body.occupation, body.influencer_category, body.primary_platform,
      body.followers_count, body.total_followers_count, body.engagement_rate,
      body.engagement_rate_tier, body.interests, body.notes,
      body.secondary_platform, body.secondary_followers_count, body.average_monthly_reach,
      body.collaboration_status, body.languages, body.portfolio_url, body.last_contact_date,
      body.record_id
    ];

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
