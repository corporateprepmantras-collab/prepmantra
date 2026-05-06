import { cookies } from 'next/headers';

export async function POST() {
  cookies().delete('authorization');
  return new Response(null, { status: 200 });
}