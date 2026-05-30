import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ShortlistPage(props: PageProps) {
  const params = await props.params;

  if (!params.slug) {
    return (
      <main>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Shortlist not found</h1>
        <p className="text-slate-700">
          No shortlist slug provided in the URL.
        </p>
      </main>
    );
  }

  const shortlist = await prisma.shortlist.findUnique({
    where: { slug: params.slug }
  });

  if (!shortlist) {
    return (
      <main>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Shortlist not found</h1>
        <p className="text-slate-700">
          This shortlist does not exist. You can create a new one from the home page.
        </p>
      </main>
    );
  }

  const carIds = JSON.parse(shortlist.carIds) as number[];

  const cars = await prisma.car.findMany({
    where: {
      id: {
        in: carIds
      }
    }
  });

  const carsById = new Map(cars.map((car) => [car.id, car]));
  const orderedCars = carIds
    .map((id) => carsById.get(id))
    .filter((c): c is (typeof cars)[number] => Boolean(c));

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Your shortlist</h1>
        <p className="mt-1 text-slate-600 text-sm">
          This link is shareable. Anyone with the URL can view these cars.
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Your original query</h2>
        <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-800">
          {shortlist.query}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Selected cars</h2>
        {orderedCars.length === 0 ? (
          <p className="text-sm text-slate-700">
            No cars found for this shortlist. It might have been created with outdated data.
          </p>
        ) : (
          <div className="space-y-3">
            {orderedCars.map((car) => (
              <div
                key={car.id}
                className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {car.make} {car.model}
                  </h3>
                  <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                    {car.bodyType ?? "Unknown"}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span>Price: ₹{car.price.toLocaleString()}</span>
                  {car.mileage != null && <span>Mileage: {car.mileage} kmpl</span>}
                  {car.safetyRating != null && (
                    <span>Safety: {car.safetyRating.toFixed(1)} / 5</span>
                  )}
                  {car.power != null && <span>Power: {car.power} bhp</span>}
                  {car.fuelType && <span>Fuel: {car.fuelType}</span>}
                  {car.transmission && <span>Transmission: {car.transmission}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}