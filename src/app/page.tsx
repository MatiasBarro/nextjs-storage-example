import { kv } from '@vercel/kv';
import { cookies } from "next/headers";
import Link from "next/link";
import { SortOrder } from "@prisma/client";
import { Preferences } from "@/types";
import dbClient from '@/utils/dbClient';
import PreferencesForm from "@/components/PreferencesForm";

const defaultPreferences: Preferences = {
    itemsPerPage: 2,
    sort: 'desc',
}

interface UserReview {
  id: number;
  user: string;
  review: string;
  date: string;
}

async function getPreferences() {
   let userId = cookies().get('userId')?.value;
    const preferences = await kv.hgetall<Preferences>(`preferences:${userId}`);
    return preferences ?? defaultPreferences;
}

async function getReviews(itemsPerPage: number, sort: string): Promise<UserReview[]> {
  const reviews = await dbClient.review.findMany({include: {user: true}, take: itemsPerPage, orderBy: {createdAt: SortOrder[sort]}});
  return reviews.map(review => ({
    id: review.id,
    user: review.user.name ?? 'Unknown',
    review: review.content,
    date: review.createdAt.toISOString()
  }));
}

export default async function Home() {
  const preferences: Preferences = await getPreferences();

  const reviews = await getReviews(preferences.itemsPerPage, preferences.sort.toString());

  return (
    <main>
     <div style={{
      display:'grid',
      gridTemplate: '[row1-start] "search preferences"[row1-end] / 2fr 1fr',
     }}>
      <div style={{gridArea: 'search', paddingRight: '2rem', display: 'flex', flexDirection:'column'}}>
        <section style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center', marginBottom: '1rem'}}>
          <h2>Reviews</h2>
          <Link href='/review/add'>Add Review</Link>
        </section>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>User</th>
              <th>Review</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(({id, user, review, date}) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{user}</td>
                <td style={{whiteSpace: 'pre-wrap'}}>{review}</td>
                <td style={{textAlign:"center"}}>{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PreferencesForm style={{gridArea: 'preferences'}} values={preferences} />
     </div>
    </main>
  )
}
