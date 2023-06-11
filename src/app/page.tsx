import PreferencesForm from "@/components/PreferencesForm";
import TestComponent from "@/components/TestComponent";
import { kv } from '@vercel/kv';
import { Preferences } from "@/types";
import { cookies } from "next/headers";
import Link from "next/link";

const defaultPreferences: Preferences = {
    itemsPerPage: 2,
    sort: 'desc',
}

async function getPreferences() {
   let userId = cookies().get('userId')?.value;
    const preferences = await kv.hgetall<Preferences>(`preferences:${userId}`);
    return preferences ?? defaultPreferences;
}

export default async function Home() {
  const preferences: Preferences = await getPreferences();
  
  return (
    <main>
     <div style={{
      display:'grid',
      gridTemplate: '[row1-start] "search preferences"[row1-end] / 2fr 1fr',
     }}>
      <div style={{gridArea: 'search', paddingRight: '2rem'}}>
        <section style={{display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
          <h2>Search Review</h2>
          <Link href='/review/add'>Add Review</Link>
        </section>
        <p>Preferences: {JSON.stringify(preferences)}</p>
      </div>
      <PreferencesForm style={{gridArea: 'preferences'}} values={preferences} />
      <TestComponent/>
     </div>
    </main>
  )
}
