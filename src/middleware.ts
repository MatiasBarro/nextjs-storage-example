import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {v4 as uuidv4} from 'uuid';
 
export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;

  if(!userId) {
    console.log('creating userid')
    const response = NextResponse.next();
    response.cookies.set('userId', uuidv4());
    return response;
  }
}

export const config = {
    matcher: ['/']
}