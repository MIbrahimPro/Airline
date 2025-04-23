import React, { useState } from 'react';


// import Footer from "../../components/footer/footer";

// import Filter from '../../components/filter/filter';
import FilterSidebar from '../../components/filtersidebar/FilterSidebar';
import FlightCard from '../../components/TicketCard/TicketCard';
import './searchResults.scss';


const dummyTickets = 
[
  {
    "id": 1,
    "recommended": true,
    "airlineLogo": "air-canada",
    "airlineName": "Air Canada",
    "deptTime": "08:00 am",
    "deptPort": "YYZ",
    "deptPortFull": "Toronto Pearson International Airport",
    "flightTime": "3h 30m",
    "stops": 0,
    "arrivalPort": "JFK",
    "arrivalPortFull": "John F. Kennedy International Airport, New York",
    "saving": 250,
    "price": 45000,
    "duration": "3h 30m"
  },
  {
    "id": 2,
    "recommended": false,
    "airlineLogo": "british-airways",
    "airlineName": "British Airways",
    "deptTime": "10:30 am",
    "deptPort": "LHR",
    "deptPortFull": "London Heathrow Airport",
    "flightTime": "6h 15m",
    "stops": 1,
    "arrivalPort": "DXB",
    "arrivalPortFull": "Dubai International Airport",
    "saving": 420,
    "price": 75000,
    "duration": "6h 15m"
  },
  {
    "id": 3,
    "recommended": false,
    "airlineLogo": "qatar-airways",
    "airlineName": "Qatar Airways",
    "deptTime": "02:00 pm",
    "deptPort": "DOH",
    "deptPortFull": "Hamad International Airport",
    "flightTime": "12h 00m",
    "stops": 2,
    "arrivalPort": "SYD",
    "arrivalPortFull": "Sydney Kingsford Smith Airport",
    "saving": 600,
    "price": 130000,
    "duration": "12h 00m"
  },
  {
    "id": 4,
    "recommended": true,
    "airlineLogo": "ryanair",
    "airlineName": "Ryanair",
    "deptTime": "06:00 am",
    "deptPort": " Dublin",
    "deptPortFull": "Dublin Airport",
    "flightTime": "1h 45m",
    "stops": 0,
    "arrivalPort": "STN",
    "arrivalPortFull": "London Stansted Airport",
    "saving": 100,
    "price": 15000,
    "duration": "1h 45m"
  },
  {
    "id": 5,
    "recommended": false,
    "airlineLogo": "aegean-airlines",
    "airlineName": "Aegean Airlines",
    "deptTime": "09:00 am",
    "deptPort": "ATH",
    "deptPortFull": "Athens International Airport",
    "flightTime": "2h 30m",
    "stops": 0,
    "arrivalPort": "ROM",
    "arrivalPortFull": "Rome Fiumicino Airport",
    "saving": 180,
    "price": 30000,
    "duration": "2h 30m"
  },
  {
    "id": 6,
    "recommended": false,
    "airlineLogo": "air-albania",
    "airlineName": "Air Albania",
    "deptTime": "11:00 am",
    "deptPort": "TIA",
    "deptPortFull": "Tirana International Airport",
    "flightTime": "1h 00m",
    "stops": 0,
    "arrivalPort": "SKP",
    "arrivalPortFull": "Skopje International Airport",
    "saving": 50,
    "price": 18000,
    "duration": "1h 00m"
  },
  {
    "id": 7,
    "recommended": true,
    "airlineLogo": "air-canada",
    "airlineName": "Air Canada",
    "deptTime": "03:00 pm",
    "deptPort": "YVR",
    "deptPortFull": "Vancouver International Airport",
    "flightTime": "4h 30m",
    "stops": 0,
    "arrivalPort": "LAX",
    "arrivalPortFull": "Los Angeles International Airport",
    "saving": 300,
    "price": 52000,
    "duration": "4h 30m"
  },
  {
    "id": 8,
    "recommended": false,
    "airlineLogo": "british-airways",
    "airlineName": "British Airways",
    "deptTime": "06:00 pm",
    "deptPort": "MAN",
    "deptPortFull": "Manchester Airport",
    "flightTime": "5h 00m",
    "stops": 1,
    "arrivalPort": "IST",
    "arrivalPortFull": "Istanbul Airport",
    "saving": 380,
    "price": 65000,
    "duration": "5h 00m"
  },
  {
    "id": 9,
    "recommended": false,
    "airlineLogo": "qatar-airways",
    "airlineName": "Qatar Airways",
    "deptTime": "08:00 pm",
    "deptPort": "DOH",
    "deptPortFull": "Hamad International Airport",
    "flightTime": "8h 00m",
    "stops": 1,
    "arrivalPort": "BKK",
    "arrivalPortFull": "Suvarnabhumi Airport",
    "saving": 550,
    "price": 90000,
    "duration": "8h 00m"
  },
  {
    "id": 10,
    "recommended": true,
    "airlineLogo": "ryanair",
    "airlineName": "Ryanair",
    "deptTime": "07:00 am",
    "deptPort": "CRL",
    "deptPortFull": "Brussels South Charleroi Airport",
    "flightTime": "1h 10m",
    "stops": 0,
    "arrivalPort": "CIA",
    "arrivalPortFull": "Ciampino–G. B. Pastine International Airport",
    "saving": 90,
    "price": 10000,
    "duration": "1h 10m"
  },
  {
    "id": 11,
    "recommended": false,
    "airlineLogo": "aegean-airlines",
    "airlineName": "Aegean Airlines",
    "deptTime": "12:00 pm",
    "deptPort": "SKG",
    "deptPortFull": "Thessaloniki Airport",
    "flightTime": "1h 30m",
    "stops": 0,
    "arrivalPort": "BEG",
    "arrivalPortFull": "Belgrade Nikola Tesla Airport",
    "saving": 120,
    "price": 22000,
    "duration": "1h 30m"
  },
  {
    "id": 12,
    "recommended": false,
    "airlineLogo": "air-albania",
    "airlineName": "Air Albania",
    "deptTime": "02:30 pm",
    "deptPort": "TIA",
    "deptPortFull": "Tirana International Airport",
    "flightTime": "2h 00m",
    "stops": 0,
    "arrivalPort": "ZAG",
    "arrivalPortFull": "Zagreb Airport",
    "saving": 100,
    "price": 30000,
    "duration": "2h 00m"
  },
  {
    "id": 13,
    "recommended": true,
    "airlineLogo": "air-canada",
    "airlineName": "Air Canada",
    "deptTime": "05:00 pm",
    "deptPort": "YEG",
    "deptPortFull": "Edmonton International Airport",
    "flightTime": "3h 00m",
    "stops": 0,
    "arrivalPort": "SEA",
    "arrivalPortFull": "Seattle–Tacoma International Airport",
    "saving": 280,
    "price": 48000,
    "duration": "3h 00m"
  },
  {
    "id": 14,
    "recommended": false,
    "airlineLogo": "british-airways",
    "airlineName": "British Airways",
    "deptTime": "07:30 pm",
    "deptPort": "GLA",
    "deptPortFull": "Glasgow Airport",
    "flightTime": "1h 15m",
    "stops": 0,
    "arrivalPort": "BFS",
    "arrivalPortFull": "Belfast International Airport",
    "saving": 70,
    "price": 13000,
    "duration": "1h 15m"
  },
  {
    "id": 15,
    "recommended": false,
    "airlineLogo": "qatar-airways",
    "airlineName": "Qatar Airways",
    "deptTime": "10:00 pm",
    "deptPort": "DOH",
    "deptPortFull": "Hamad International Airport",
    "flightTime": "10h 30m",
    "stops": 1,
    "arrivalPort": "KUL",
    "arrivalPortFull": "Kuala Lumpur International Airport",
    "saving": 700,
    "price": 110000,
    "duration": "10h 30m"
  },
  {
    "id": 16,
    "recommended": false,
    "airlineLogo": "riyadh-air",
    "airlineName": "Riyadh Air",
    "deptTime": "09:00 am",
    "deptPort": "RUH",
    "deptPortFull": "King Khalid International Airport",
    "flightTime": "2h 30m",
    "stops": 0,
    "arrivalPort": "JED",
    "arrivalPortFull": "King Abdulaziz International Airport",
    "saving": 150,
    "price": 38000,
    "duration": "2h 30m"
  },
  {
    "id": 17,
    "recommended": true,
    "airlineLogo": "riyadh-air",
    "airlineName": "Riyadh Air",
    "deptTime": "02:00 pm",
    "deptPort": "JED",
    "deptPortFull": "King Abdulaziz International Airport",
    "flightTime": "4h 00m",
    "stops": 1,
    "arrivalPort": "DXB",
    "arrivalPortFull": "Dubai International Airport",
    "saving": 300,
    "price": 60000,
    "duration": "4h 00m"
  },
  {
    "id": 18,
    "recommended": false,
    "airlineLogo": "ryanair",
    "airlineName": "Ryanair",
    "deptTime": "04:00 pm",
    "deptPort": "MAD",
    "deptPortFull": "Adolfo Suárez Madrid–Barajas Airport",
    "flightTime": "2h 15m",
    "stops": 0,
    "arrivalPort": "LIS",
    "arrivalPortFull": "Lisbon Airport",
    "saving": 120,
    "price": 16000,
    "duration": "2h 15m"
  },
  {
    "id": 19,
    "recommended": false,
    "airlineLogo": "aegean-airlines",
    "airlineName": "Aegean Airlines",
    "deptTime": "06:30 pm",
    "deptPort": "HER",
    "deptPortFull": "Heraklion International Airport",
    "flightTime": "3h 00m",
    "stops": 0,
    "arrivalPort": "TLV",
    "arrivalPortFull": "Ben Gurion Airport",
    "saving": 200,
    "price": 42000,
    "duration": "3h 00m"
  },
  {
    "id": 20,
    "recommended": true,
    "airlineLogo": "british-airways",
    "airlineName": "British Airways",
    "deptTime": "09:00 pm",
    "deptPort": "BOM",
    "deptPortFull": "Chhatrapati Shivaji Maharaj International Airport",
    "flightTime": "7h 45m",
    "stops": 1,
    "arrivalPort": "LHR",
    "arrivalPortFull": "London Heathrow Airport",
    "saving": 580,
    "price": 95000,
    "duration": "7h 45m"
  }
]



export default function SearchResultsPage() {
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <div className="results-page">
      {/* Desktop Filter Sidebar */}
      <aside className="filter-sidebar">
        <FilterSidebar />
      </aside>

      {/* Main Results */}
      <main className="results-main">
        {/* Mobile Filter Button */}
        <button
          className="mobile-filter-btn"
          onClick={() => setShowFilterModal(true)}
        >
          Filter
        </button>

        {/* Existing Filter Modal (no-ops on submit) */}
        {/* <Filter
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onSubmit={() => setShowFilterModal(false)}
        /> */}

        {/* Ticket Cards */}
        <div className="tickets-list">
          {dummyTickets.map((ticket) => (

          <FlightCard
          key={ticket.id} // Add a key prop, which is required when mapping over an array
          recommended={ticket.recommended}
          airlineLogo={ticket.airlineLogo}
          airlineName={ticket.airlineName}
          deptTime={ticket.deptTime}
          deptPort={ticket.deptPort}
          deptPortFull={ticket.deptPortFull}
          flightTime={ticket.flightTime}
          stops={ticket.stops}
          arrivalPort={ticket.arrivalPort}
          arrivalPortFull={ticket.arrivalPortFull}
          saving={ticket.saving}
          price={ticket.price}
        />
          ))}
        </div>
      </main>
    </div>
  );
}
