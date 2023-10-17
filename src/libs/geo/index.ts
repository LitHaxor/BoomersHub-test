export async function getLatLong(address: string, city: string, state: string) {
  try {
    const query = `${address} ${city} ${state} USA`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q="${query}"&format=json`
    );
    const data = await res?.json();

    if (data?.[0]?.lat && data?.[0]?.lon) {
      return {
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
