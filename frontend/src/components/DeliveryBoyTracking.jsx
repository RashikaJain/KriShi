import React from 'react'
import scooter from "../assets/scooter.png"
import home from "../assets/home.png"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet"


const deliveryBoyIcon = new L.icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
})

// iconAnchor decides which part of the icon touches the location point.
const customerIcon = new L.icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
})

function DeliveryBoyTracking({ data }) {

  // get the current data
  const deliverBoyLat = data?.deliveryBoyLocation.lat;
  const deliveryBoyLon = data?.deliveryBoyLocation.lon;
  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;

  // create path to give to map as coordinates
  const path = [
    [deliverBoyLat, deliveryBoyLon],
    [customerLat, customerLon]
  ]

  // map will show delivery Boy location
  const center = [deliverBoyLat, deliveryBoyLon]

  return (
    <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
      <MapContainer className='w-full h-full'
        center={center} scrollWheelZoom={false} zoom={16}>
        <TileLayer
          attribution='&copy; 
          <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[deliverBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
          {/* <Popup>Delivery Boy</Popup> */}
        </Marker>

        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
        </Marker>

        <Polyline positions={path} weight={4}>
        </Polyline>

      </MapContainer>
    </div>
  )
}

export default DeliveryBoyTracking