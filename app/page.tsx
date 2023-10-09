import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Description from "./description";
import { cookies } from "next/headers";
import LocationSelector from "./location-selector";

export const dynamic = "force-dynamic";

export default async function Home() {
  
  const supabase = createServerComponentClient<Database>({cookies});
  const { data } = await supabase
          .from('regions')
          .select('*, cities (*), registrations(*)');

  const { data: { session } } = await supabase.auth.getSession();
  let locations: LocationData[] = []

  if (data) {
    locations = data.map(r => {
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
  }

  return (
  <div className="flex flex-col h-full w-full px-8">
    <Description />
    <LocationSelector locations={locations} session={session} />
  </div>
  )
}
