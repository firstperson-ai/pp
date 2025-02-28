'use client';

import { createClient } from '@supabase/supabase-js';

// Ensure Supabase is properly imported
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PLANS = {
  Basic: { max_resumes: 1, support_level: 'Standard' },
  Pro: { max_resumes: 5, support_level: 'Priority' },
  Premium: { max_resumes: 10, support_level: 'Priority' },
  Ultimate: { max_resumes: 18, support_level: '24/7 Priority' },
};

/**
 * Subscribe a user to a selected plan.
 * @param {string} userId - The user ID
 * @param {string} plan - The subscription plan (Basic, Pro, Premium, Ultimate)
 * @returns {Promise<{ message: string }>} - Success message
 */
export async function subscribeUser(userId, plan) {
  if (!userId || !PLANS[plan]) throw new Error('Invalid user ID or plan');

  try {
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan,
        max_resumes: PLANS[plan].max_resumes,
        support_level: PLANS[plan].support_level,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });

    if (subscriptionError) throw subscriptionError;

    const { error: userError } = await supabase
      .from('users')
      .update({
        subscription_status: 'Subscribed',
        resume_downloads_remaining: PLANS[plan].max_resumes,
      })
      .eq('id', userId);

    if (userError) throw userError;

    return { message: `Subscribed to ${plan} successfully` };
  } catch (error) {
    console.error('Subscription Error:', error);
    throw new Error('Failed to subscribe user.');
  }
}

/**
 * Check if a user has available downloads.
 * @param {string} userId - The user ID
 * @returns {Promise<number>} - Remaining downloads
 */
export async function checkDownloadLimit(userId) {
  if (!userId) throw new Error('User ID is required');

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_status, resume_downloads_remaining')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!user || user.subscription_status !== 'Subscribed' || user.resume_downloads_remaining <= 0) {
      throw new Error('No downloads remaining or user not subscribed');
    }

    return user.resume_downloads_remaining;
  } catch (error) {
    console.error('Download Check Error:', error);
    throw new Error('Failed to check download limit.');
  }
}

/**
 * Decrease the user's download count by 1.
 * @param {string} userId - The user ID
 * @returns {Promise<{ downloadsRemaining: number }>} - Remaining downloads
 */
export async function decrementDownload(userId) {
  if (!userId) throw new Error('User ID is required');

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('resume_downloads_remaining')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!user || user.resume_downloads_remaining <= 0) {
      throw new Error('No downloads remaining');
    }

    const remainingDownloads = user.resume_downloads_remaining - 1;

    // Use a transaction-like approach for atomicity
    const [{ error: updateError }, { error: logError }] = await Promise.all([
      supabase.from('users').update({ resume_downloads_remaining: remainingDownloads }).eq('id', userId),
      supabase.from('resume_downloads').insert({ user_id: userId, download_count: 1 }),
    ]);

    if (updateError) throw updateError;
    if (logError) throw logError;

    return { downloadsRemaining: remainingDownloads };
  } catch (error) {
    console.error('Decrement Download Error:', error);
    throw new Error('Failed to decrement download count.');
  }
}
