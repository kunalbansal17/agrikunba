export async function geocodeGoogle(
  query: string
): Promise<{ lat: number; lon: number; label: string; pincode?: string } | null> {
  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_MAPS_KEY}`
    );
    if (!resp.ok) return null;

    const data = await resp.json();
    if (!data.results || data.results.length === 0) return null;

    const best = data.results[0];
    const loc = best.geometry.location;

    let pincode: string | undefined = undefined;
    const comp = best.address_components.find((c: any) =>
      c.types.includes("postal_code")
    );
    if (comp) pincode = comp.long_name;

    return {
      lat: loc.lat,
      lon: loc.lng,
      label: best.formatted_address,
      pincode,
    };
  } catch (err) {
    console.error("Google geocode error:", err);
    return null;
  }
}
