import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { email, password, name } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const { error } = await supabase.from('users').insert({
      id: userId,
      email,
      name,
      password: hashedPassword,
    });

    if (error) throw new Error(error.message);

    // Return user ID for client-side storage
    return new Response(JSON.stringify({ message: 'Signup successful', userId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}