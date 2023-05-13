'use client'

import { useEffect, useState } from "react";
import { Preferences } from "@/types";

export default function TestComponent() {
    console.log('rendering TestComponent')
    const [preferences, setPreferences] = useState<Preferences>();

    useEffect(() => {
        console.log('fetching preferences');
        fetch('http://localhost:5001/api/preferences').then(res => res.json()).then(setPreferences);
    }, [])
    

    return (
        <p>{`Preferences Client: ${JSON.stringify(preferences)}`}</p>
    )
}