import { CSSProperties } from "react";
import { Preferences } from "@/types";

import { kv } from '@vercel/kv';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const itemsPerPageOptions = [{label: '1', value: 1}, {label: '2', value: 2}, {label: '5', value: 5}, {label: '10', value: 10}];
const sortOptions = [{label: 'Ascendent', value: 'asc'}, {label: 'Descendent', value: 'desc'}];

const Preferences = ({style, values}: {style: CSSProperties, values: Preferences}) => {
    async function updatePreferences(data: FormData) {
        'use server';
        let userId = cookies().get('userId')?.value;

        if(!userId) {
            throw new Error('User not found');
        }

        const preferences = {itemsPerPage: Number(data.get('itemsPerPage')?.toString() ?? 10), sort: data.get('sort')?.toString() ?? 'asc'}


        try {
            const result = await kv.hset(`preferences:${userId}`, preferences);

        } catch(err) { 
            console.error(err);
        }

        revalidatePath('/')
    }
    
    return(
        <div style={style}>
            <h2>Preferences</h2>
            <form action={updatePreferences}>
                <fieldset style={{display: 'flex', gap: '20px'}}>
                    <legend>Items per page</legend>
                    <select name="itemsPerPage" id="itemsPerPage" defaultValue={values.itemsPerPage}>
                        {itemsPerPageOptions.map(({label, value}) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </fieldset>
                <fieldset style={{display: 'flex', gap: '20px', marginTop:'2rem'}}>
                    <legend>Sort</legend>
                    <select name="sort" id="sort" defaultValue={values.sort}>
                        {sortOptions.map(({label, value}) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </fieldset>
                <button type="submit" style={{marginTop: '2rem', padding: '0.5rem 2rem'}}>Save</button>
            </form>
        </div>
    )

}


export default Preferences;