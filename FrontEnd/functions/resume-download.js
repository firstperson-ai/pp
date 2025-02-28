import { supabase } from "@/lib/supabase-client"; // Use supabase-client for user-side actions

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request" });
  }

  try {
    // Fetch user details along with subscription data in a single optimized query
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("subscription_status, resume_downloads_remaining, subscriptions(max_resumes)")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("User fetch error:", userError);
      return res.status(404).json({ error: "User not found or database error" });
    }

    const { subscription_status, resume_downloads_remaining, subscriptions } = user;
    const maxResumes = subscriptions?.max_resumes || 0;

    // Validate subscription and download limits
    if (subscription_status !== "Subscribed") {
      return res.status(403).json({ error: "User is not subscribed" });
    }

    if (resume_downloads_remaining <= 0) {
      return res.status(403).json({ error: "No downloads remaining" });
    }

    if (resume_downloads_remaining > maxResumes) {
      return res.status(403).json({ error: "Download limit exceeded" });
    }

    // Perform atomic transaction: Decrement downloads & log download
    const { error: updateError } = await supabase
      .from("users")
      .update({ resume_downloads_remaining: resume_downloads_remaining - 1 })
      .eq("id", userId);

    const { error: logError } = await supabase
      .from("resume_downloads")
      .insert({ user_id: userId, download_count: 1 });

    if (updateError || logError) {
      console.error("Database update error:", updateError || logError);
      return res.status(500).json({ error: "Failed to update download status" });
    }

    return res.status(200).json({
      message: "Resume downloaded successfully",
      downloadsRemaining: resume_downloads_remaining - 1,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
