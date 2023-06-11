import dbClient from "@/utils/dbClient"
import { redirect } from "next/navigation";

export default async function AddReviewPage() {
    async function addReview(data: FormData) {
        'use server';
        try {
           await dbClient.review.create({
                data: {
                    content: data.get('content') as string,
                    userId: Number(data.get('user'))
                }
           })
        } catch(err) { 
            console.error(err);
        }

        redirect('/')
    }

    const users = await dbClient.user.findMany();

    return (
        <div>
            <h2>Add Review</h2>
            <form action={addReview}>
                <div style={{display: 'flex', flexDirection:'column', gap: '0.5rem', width:'300px', marginBottom:'1rem'}}>
                    <label htmlFor="user">User</label>
                    <select name="user" id="user">
                        {users.map(({id, name}) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
                <div style={{display: 'flex', flexDirection:'column', gap: '0.5rem', width:'300px'}}>
                    <label htmlFor="content">Review</label>
                    <textarea name="content" style={{height: '100px'}}/>
                </div>
                <button type="submit" style={{marginTop: '2rem', padding: '0.5rem 2rem'}}>Save</button>
            </form>
        </div>
    )
}