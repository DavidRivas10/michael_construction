import { MapArt } from "./BrandArt";

// Mapa real de la zona de servicio, sin necesidad de API key: el embed
// público de Google Maps (google.com/maps?...&output=embed) funciona con
// solo un texto de dirección/ciudad — no requiere una cuenta de Google
// Cloud ni facturación, a diferencia del API de Maps JavaScript/Places.
// Si Michael todavía no puso una ciudad real (el placeholder "[Your City]"
// sigue en la configuración), se muestra el mapa ilustrado de siempre en
// vez de un embed roto apuntando a un texto sin sentido.
export default function ServiceAreaMap({ config, className = "" }) {
  const area = config?.serviceArea?.trim();
  const isPlaceholder = !area || area.startsWith("[");

  if (isPlaceholder) {
    return <MapArt className={className} />;
  }

  const query = encodeURIComponent(area);

  return (
    <iframe
      title="Service area map"
      src={`https://www.google.com/maps?q=${query}&output=embed`}
      className={className}
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
