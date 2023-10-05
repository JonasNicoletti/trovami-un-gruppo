'use client'

import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_SUBMIT_TEXT = "Iscriviti al gruppo"
export const dynamic = "force-dynamic";

export default function LocationSelectorClient({ locations, session }: { locations: LocationData[], session: Session | null }) {
    const supabase = createClientComponentClient<Database>();
    const [submitText, setSubmitText] = useState<string>(DEFAULT_SUBMIT_TEXT);
    const [location, setLocation] = useState<LocationData>();
    const [city, setCity] = useState<City>();
    const [cities, setCities] = useState<City[]>();
    const [showRegions, setShowRegions] = useState(false);
    const [showCities, setShowCities] = useState(false);
    const router = useRouter();

    function updateRegion(location: LocationData) {
        setLocation(location)
        setCities(location.cities)
        setCity(undefined)
        setShowRegions(false)
    }
    function updateCity(c: City): void {
        setCity(c)
        setShowCities(false)
    }

    function updateText(): void {
        if (session) return;
        setSubmitText("fai il login per iscriverti ad un gruppo")
    }

    function resetText(): void {
        if (session) return
        setSubmitText(DEFAULT_SUBMIT_TEXT)
    }

    async function submitRegistration() {
        if (city?.is_registered) {
            await supabase.from('registrations')
                .delete()
                .match({ user_id: session?.user.id, city_id: city?.id, region_id: location?.id });
        } else {
            await supabase.from('registrations')
                .insert({ user_id: session?.user.id, city_id: city?.id, region_id: location?.id });
        }

    }
    function getSubmitBtnColor(): string {
        if (city?.is_registered) {
            return 'red';
        }
        return 'green'

    }
    useEffect(() => {
        if (city?.is_registered) {
            setSubmitText("Cancella registrazione")
            return;
        }
        setSubmitText(DEFAULT_SUBMIT_TEXT)
    }, [city]);

    useEffect(() => {
        const channel = supabase.channel("realtime-registrations")
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'registrations' }, () => {
                    router.refresh();
                }).subscribe();
        return () => { supabase.removeChannel(channel) };
    }, [supabase, router]
    )

    return <div className="flex justify-center">
        <div className="flex flex-col w-52 m-8">
            <button onClick={() => setShowRegions(!showRegions)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
                {location ? location.name : 'scegli la tua regione'}
                <svg className="w-2.5 h-2.5 ml-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div hidden={!showRegions} className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
                    {locations?.map(r =>
                        <li onClick={_ => updateRegion(r)} key={r.id} value={r.id}>
                            <button type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                                <div className="inline-flex items-center w-full">
                                    {r.name}
                                    <span className={`h-4 w-4 ml-auto ${r.no_registrations > 0 ? 'text-green-500' : 'text-gray-500'}`} >{r.no_registrations}</span>
                                </div>
                            </button>
                        </li>)}
                </ul>
            </div>
        </div>
        <div className="flex flex-col w-52 m-8">
            <button disabled={cities == undefined} onClick={() => setShowCities(!showCities)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
                {city ? city.name : 'scegli la tua cittá'}
                <svg className="w-2.5 h-2.5 ml-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div hidden={!showCities} className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
                    {cities?.map(c =>
                        <li onClick={_ => updateCity(c)} key={c.id} value={c.id}>
                            <button type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                                <div className="inline-flex items-center w-full">
                                    {c.name}
                                    <span className={`h-4 w-4 ml-auto ${c.no_registrations > 0 ? 'text-green-500' : 'text-gray-500'}`}>{c.no_registrations}</span>
                                </div>
                            </button>
                        </li>)}
                </ul>
            </div>
        </div>
        <div className="flex flex-col w-52 m-8">
            <button type="submit" onMouseOut={resetText} onMouseEnter={updateText} onClick={submitRegistration} className={`text-white bg-${getSubmitBtnColor()}-700 hover:bg-${getSubmitBtnColor()}-800 focus:ring-4 focus:outline-none focus:ring-${getSubmitBtnColor()}-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-${getSubmitBtnColor()}-600 dark:hover:bg-${getSubmitBtnColor()}-700 dark:focus:ring-${getSubmitBtnColor()}-800`}>{submitText}</button>
        </div>

    </div>
}