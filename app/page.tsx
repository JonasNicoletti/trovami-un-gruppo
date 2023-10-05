import LocationSelectorServer from "./location-selector-server";

export const dynamic = "force-dynamic";

export default async function Home() {

  return (
  <div className="w-full mx-auto px-4">
    <LocationSelectorServer />
  </div>
  )
}
