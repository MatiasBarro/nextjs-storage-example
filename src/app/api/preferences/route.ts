import { NextResponse } from 'next/server';

import { type Preferences } from '@/types';

import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';

const defaultPreferences: Preferences = {
    itemsPerPage: 2,
    sort: 'desc',
}

export async function GET() {
    let userId = cookies().get('userId')?.value;

    let preferences = await kv.hgetall<Preferences>(`preferences:${userId}`)

    console.log('preferences',preferences)

    return NextResponse.json(preferences);
}