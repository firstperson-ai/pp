import { supabase } from "@/lib/supabase-client"; // Use supabase-client for security

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date().toISOString();

    // Get expired subscriptions with only necessary fields
    const { data: expiredSubs, error: subError } = await supabase
      .from("subscriptions")
      .select("user_id")
      .lte("end_date", now);

    if (subError || !expiredSubs.length) {
      console.error("Subscription Fetch Error:", subError);
      return res.status(200).json({ message: "No expired subscriptions found" });
    }

    const expiredUserIds = expiredSubs.map((sub) => sub.user_id);

    // Batch delete expired subscriptions
    const { error: deleteError } = await supabase
      .from("subscriptions")
      .delete()
      .in("user_id", expiredUserIds);

    if (deleteError) {
      console.error("Subscription Deletion Error:", deleteError);
      return res.status(500).json({ error: "Failed to remove expired subscriptions" });
    }

    // Batch update users who lost subscriptions
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        subscription_status: "Not Subscribed",
        resume_downloads_remaining: 0,
      })
      .in("id", expiredUserIds);

    if (userUpdateError) {
      console.error("User Update Error:", userUpdateError);
      return res.status(500).json({ error: "Failed to update user subscription status" });
    }

    return res.status(200).json({ message: "Expired subscriptions removed, users updated" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
