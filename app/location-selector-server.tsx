import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LocationSelectorClient from "./location-selector-client";

export const dynamic = "force-dynamic";

export default async function LocationSelectorServer() {
    const supabase = createServerComponentClient<Database>({cookies});
    
    const { data } = await supabase
      .from('regions')
      .select('*, cities (*), registrations(*)')
  
    const { data: { session } } = await supabase.auth.getSession();

    if (data){
      const locations = data.map(r => {
        const cities = r.cities.map(c => {
          return {
            ...c,
            no_registrations: r.registrations.filter(reg => reg.city_id===c.id).length,
            is_registered: session != null && r.registrations.filter(reg => session.user.id===reg.user_id && reg.city_id===c.id ).length > 0
          }
        });
        return {
          id: r.id,
          name: r.name,
          cities: cities,
          no_registrations: r.registrations.length
        }
      })
      return <LocationSelectorClient locations={locations} session={session}/>
    }
}