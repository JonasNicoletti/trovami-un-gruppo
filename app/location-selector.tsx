'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserPlus, ChevronLeft, UserMinus } from "lucide-react"
import Link from "next/link";


type CardType = 'regions' | 'cities' | 'registration';

export default function LocationSelector({ locations, session }: { locations: LocationData[], session: Session | null }) {
    const supabase = createClientComponentClient<Database>();
    const [submitText, setSubmitText] = useState<string>();
    const [location, setLocation] = useState<LocationData>();
    const [city, setCity] = useState<City>();
    const [visibileCard, setVisibileCard] = useState<CardType>('regions');
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel("realtime-registrations")
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'registrations' },
                () => router.refresh()
            )
            .subscribe();
        return () => { supabase.removeChannel(channel) };
    }, [supabase, router]);

    useEffect(() => {
        if (location && city) {
            const l = locations.find(l => l.id === location.id);
            if (l) {
                setLocation(l);
                const c = l.cities.find(c => c.id === city.id)
                if (c) setCity(c);
            }
        }
    }, [locations])

    function updateRegion(locationId: string) {
        const location = locations.find(l => l.id === +locationId);
        if (location) {
            setCity(undefined)
            setLocation(location)
            setVisibileCard('cities')
        }
    }
    function updateCity(cityId: string): void {
        const city = location?.cities.find(c => c.id === +cityId);
        if (city) {
            setCity(city)
            setVisibileCard('registration')
        }
    }

    async function submitRegistration() {
        if (!city || !location || !session) {
            return;
        }
        if (city?.is_registered) {
            await supabase.from('registrations')
                .delete()
                .match({ user_id: session.user.id, city_id: city.id, region_id: location.id });
        } else {
            await supabase.from('registrations')
                .insert({ user_id: session.user.id, city_id: city.id, region_id: location.id });
        }
    }

    useEffect(() => {
        if (session) {
            if (city?.is_registered) {
                setSubmitText("Cancella registrazione")
                return;
            }
            setSubmitText("Iscriviti al gruppo")
            return
        }
        setSubmitText("Accedi per iscriverti")
    }, [session, city]);

    if (visibileCard == "regions") {
        return <div className="flex flex-col mt-8 mx-auto w-72 max-h-50">
            <Card >
                <CardHeader>
                    <CardTitle className="text-center">Regione</CardTitle>
                </CardHeader>
                <CardContent className="flex mt-6 h-50">
                    <Select onValueChange={e => updateRegion(e)} >
                        <SelectTrigger >
                            <SelectValue placeholder="Scegli la tua regione" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-[10rem]">
                            <SelectGroup >
                                {locations.map(l => <SelectItem className="w-full px-2" key={l.id} value={String(l.id)} ><><Badge className={`bg-whit ${l.no_registrations > 0 ? 'text-green-500' : 'text-gray-500'} mr-6 ml-0`}>{l.no_registrations}</Badge> {l.name}</></SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card> </div>;
    } else if (visibileCard == 'cities') {
        return <div className="flex flex-col mt-8 mx-auto w-72 max-h-44">
            <Card >
                <CardHeader>
                    <CardTitle className="text-center">{location?.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex">
                    <Select onValueChange={e => updateCity(e)} >
                        <SelectTrigger >
                            <SelectValue placeholder="Scegli la tua provincia" />
                        </SelectTrigger>
                        <SelectContent className="overflow-y-auto max-h-[10rem]">
                            <SelectGroup >
                                {location?.cities.map(c => <SelectItem className="w-full px-2" key={c.id} value={String(c.id)} ><><Badge className={`bg-whit ${c.no_registrations > 0 ? 'text-green-500' : 'text-gray-500'} mr-6 ml-0`}>{c.no_registrations}</Badge> {c.name}</></SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter className="p-2 pb-0">
                    <Button onClick={() => setVisibileCard('regions')} variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card></div>;
    }

    return <div className="flex flex-col mt-8 mx-auto w-72 max-h-44">
        <Card >
            <CardHeader>
                <CardTitle className="text-center">{location?.name}</CardTitle>
                <CardDescription className="text-center">{city?.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <Progress value={((city?.no_registrations || 0) / 10) * 100} />
                <small className="text-sm font-medium leading-none mt-2">{city && city?.no_registrations > 0 ? city?.no_registrations == 1 ? `Una persona é registrata.` : city?.no_registrations + ' persone sono registrate.' : 'Registarti per primo.'}  </small>
                {session ?
                    <Button className="mt-8" onClick={submitRegistration}>
                         {city?.is_registered ? <> <UserMinus className="mr-2 h-6 w-6" />  </> : <><UserPlus className="mr-2 h-6 w-6" /> </>} {submitText}
                    </Button>
                    :
                    <Button asChild  className="mt-8">
                        <Link href="/auth">{submitText}</Link>
                    </Button>
                }
            </CardContent>
            <CardFooter className="p-2">
                <Button onClick={() => setVisibileCard('cities')} variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card></div>;


}