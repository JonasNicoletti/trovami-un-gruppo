'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation";

export default function Logout() {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter()
    const logout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }
    return <h1 onClick={logout}className="text-xl font-bold cursor-pointer">Logout</h1>

}