import { Database as DB } from "@/lib/database.types";

type C = DB['public']['Tables']['cities']['Row'];

declare global {
    type Database = DB
    type City = C & {
        no_registrations: number, is_registered: boolean
    }
    type LocationData = {
        id: number;
        name: string;
        cities: City[];
        no_registrations: number;
    }
}