import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Circle
} from 'react-leaflet'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// ✅ FIXED ZONES (YOUR REQUIRED FEATURE)
const fixedZones = [
  {
    name: "Sundarbans Conservation Zone",
    zone: "conservation",
    center: [21.9497, 89.1833],
    radius: 8000,
  },
  {
    name: "Jim Corbett National Park",
    zone: "protected",
    center: [29.5300, 78.7747],
    radius: 7000,
  },
  {
    name: "Kaziranga National Park",
    zone: "protected",
    center: [26.5775, 93.1711],
    radius: 7500,
  },
  {
    name: "Bandipur Forest Zone",
    zone: "conservation",
    center: [11.6643, 76.6297],
    radius: 6000,
  },
  {
    name: "Ranthambore National Park",
    zone: "restricted",
    center: [26.0173, 76.5026],
    radius: 6500,
  },
  {
    name: "Gir Forest",
    zone: "conservation",
    center: [21.1240, 70.8240],
    radius: 7000,
  },
  {
    name: "Periyar Wildlife Sanctuary",
    zone: "protected",
    center: [9.4625, 77.2366],
    radius: 6000,
  },
  {
    name: "Simlipal Forest",
    zone: "conservation",
    center: [21.8333, 86.3333],
    radius: 6500,
  },
  {
    name: "Manas National Park",
    zone: "protected",
    center: [26.6590, 91.0011],
    radius: 7000,
  },
  {
    name: "Silent Valley Forest",
    zone: "restricted",
    center: [11.0667, 76.4333],
    radius: 5000,
  },
  {
    name: "Nanda Devi Biosphere Reserve",
    zone: "restricted",
    center: [30.3752, 79.9669],
    radius: 8000,
  },
  {
    name: "Great Himalayan National Park",
    zone: "protected",
    center: [31.7354, 77.3507],
    radius: 9000,
  },
  {
    name: "Satpura National Park",
    zone: "conservation",
    center: [22.4083, 78.1056],
    radius: 7000,
  },
  {
    name: "Pench Tiger Reserve",
    zone: "protected",
    center: [21.7855, 79.2000],
    radius: 6500,
  },
  {
    name: "Dudhwa National Park",
    zone: "restricted",
    center: [28.5000, 80.5000],
    radius: 7000,
  },
  {
    name: "Sariska Tiger Reserve",
    zone: "restricted",
    center: [27.3294, 76.4370],
    radius: 6000,
  },
  {
    name: "Kanha National Park",
    zone: "conservation",
    center: [22.3344, 80.6115],
    radius: 8000,
  },
  {
    name: "Tadoba Forest",
    zone: "restricted",
    center: [20.2167, 79.3667],
    radius: 6500,
  },
  {
    name: "Valmiki National Park",
    zone: "protected",
    center: [27.4333, 84.1333],
    radius: 7000,
  },
  {
    name: "Bhitar Kanika Mangrove",
    zone: "conservation",
    center: [20.7333, 86.8667],
    radius: 6000,
  }
]

// Auto recenter
const RecenterMap = ({ position }) => {
  const map = useMap()
  map.setView(position)
  return null
}

const InteractiveMap = ({
  onLocationSelect,
  forestData = [],
  issueReports = [],
}) => {
  const [position, setPosition] = useState([22.5726, 88.3639])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude])
        },
        () => {
          console.log('Geolocation failed')
        }
      )
    }
  }, [])

  const getZoneColor = (zone) => {
    switch (zone) {
      case 'conservation':
        return 'green'
      case 'recreation':
        return 'blue'
      case 'protected':
        return 'orange'
      case 'restricted':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={
          forestData.length > 0 && forestData[0]?.location?.coordinates
            ? [
                forestData[0].location.coordinates[1],
                forestData[0].location.coordinates[0]
              ]
            : position
        }
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <RecenterMap position={position} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔥 FIXED COLORED ZONES (THIS WAS MISSING) */}
        {fixedZones.map((zone, index) => (
          <Circle
            key={index}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: getZoneColor(zone.zone),
              fillColor: getZoneColor(zone.zone),
              fillOpacity: 0.4,
            }}
          >
            <Popup>
              <strong>{zone.name}</strong>
            </Popup>
          </Circle>
        ))}

        {/* Forest Data (points) */}
        {Array.isArray(forestData) &&
          forestData.map((data, index) => {
            const lat = data?.location?.coordinates?.[1]
            const lng = data?.location?.coordinates?.[0]

            if (!lat || !lng) return null

            return (
              <CircleMarker
                key={index}
                center={[lat, lng]}
                radius={20}
                pathOptions={{
                  color: 'black',
                  fillColor: getZoneColor(data.zone),
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <strong>{data.zone} Zone</strong><br />
                  Trees: {data.treeCount || 'N/A'}
                </Popup>
              </CircleMarker>
            )
          })}

        {/* Current Location */}
        <Marker
          position={position}
          eventHandlers={{
            click: (e) =>
              onLocationSelect && onLocationSelect(e.latlng),
          }}
        >
          <Popup>
            Current Location <br />
            Click to select this location
          </Popup>
        </Marker>

        {/* Issue Reports */}
        {Array.isArray(issueReports) &&
          issueReports.map((report, index) => {
            const lat = report?.location?.coordinates?.[1]
            const lng = report?.location?.coordinates?.[0]

            if (!lat || !lng) return null

            return (
              <Marker key={index} position={[lat, lng]}>
                <Popup>
                  <strong>Issue:</strong> {report.type} <br />
                  <strong>Severity:</strong> {report.severity} <br />
                  <strong>Status:</strong> {report.status}
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>
    </div>
  )
}

export default InteractiveMap
