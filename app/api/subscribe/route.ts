import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import * as z from "zod";

const subscribeSchema = z.object({
  hotel_id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = subscribeSchema.parse(json);

    const supabase = await createClient();

    const { data: hotel } = await supabase
      .from("hotels")
      .select("id")
      .eq("id", body.hotel_id)
      .single();

    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      );
    }

    const { data: existingSubscriber } = await supabase
      .from("subscribers")
      .select("id")
      .eq("hotel_id", body.hotel_id)
      .eq("email", body.email)
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({
        hotel_id: body.hotel_id,
        email: body.email,
        name: body.name,
      });

    if (insertError) {
      console.error("Error inserting subscriber:", insertError);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in subscribe route:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
} 