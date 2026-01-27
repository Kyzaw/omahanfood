import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: -6.595038,
  lng: 106.816635
};

export default function MapPicker() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, 
    libraries: ['places']
  });

  const [location, setLocation] = useState(center);
  const [address, setAddress] = useState("");

  const handleClick = async (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (!lat || !lng) return;

    setLocation({ lat, lng });

    const geocoder = new google.maps.Geocoder();
    const results = await geocoder.geocode({ location: { lat, lng } });
    if (results.results[0]) {
      setAddress(results.results[0].formatted_address);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="p-4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={15}
        onClick={handleClick}
      >
        <Marker position={location} />
      </GoogleMap>
      <div className="mt-4">
        <strong>Alamat Terpilih:</strong>
        <p>{address || "Klik pada peta untuk memilih lokasi."}</p>
      </div>
    </div>
  );
}
