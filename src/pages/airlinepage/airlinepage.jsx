import React from 'react';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import './airlinepage.scss';



const airlinesData = [
    {
        id: 'aegean-airlines',
        name: 'Aegean Airlines',
        description: 'The flag carrier and largest airline of Greece, providing services across Europe and the Mediterranean.',
        abb: 'Aegean',
    },
    {
        id: 'air-albania',
        name: 'Air Albania',
        description: 'The flag carrier of Albania, connecting the country with various European destinations.',
        abb: 'Air Albania',
    },
    {
        id: 'air-canada',
        name: 'Air Canada',
        description: 'Canada’s largest carrier, renowned for its extensive network and service quality.',
        abb: 'Air Canada',
    },
    {
        id: 'air-france',
        name: 'Air France',
        description: 'The flag carrier of France, a major global airline with a strong presence in Europe and worldwide.',
        abb: 'Air France',
    },
    {
        id: 'air-india',
        name: 'Air India',
        description: 'The flag carrier of India, with an extensive domestic and international network.',
        abb: 'Air India',
    },
    {
        id: 'air-mauritius',
        name: 'Air Mauritius',
        description: 'The flag carrier of Mauritius, connecting the island nation with destinations in Africa, Asia, Europe, and Oceania.',
        abb: 'Air Mauritius',
    },
    {
        id: 'air-new-zealand',
        name: 'Air New Zealand',
        description: 'The flag carrier of New Zealand, known for its innovation and services in the Pacific region and beyond.',
        abb: 'Air New Zealand',
    },
    {
        id: 'air-serbia',
        name: 'Air Serbia',
        description: 'The flag carrier of Serbia, offering connections across Europe, the Mediterranean, and the Middle East.',
        abb: 'Air Serbia',
    },
    {
        id: 'air-transat',
        name: 'Air Transat',
        description: 'A Canadian leisure airline, primarily serving holiday destinations in Europe, the Americas, and the Caribbean.',
        abb: 'Air Transat',
    },
    {
        id: 'akasa-air',
        name: 'Akasa Air',
        description: 'An Indian low-cost airline focused on providing affordable and reliable air travel within India.',
        abb: 'Akasa Air',
    },
    {
        id: 'asiana-airlines',
        name: 'Asiana Airlines',
        description: 'One of South Korea\'s major airlines, with a significant international network.',
        abb: 'Asiana',
    },
    {
        id: 'avianca',
        name: 'avianca',
        description: 'The flag carrier of Colombia and one of the oldest airlines in the world, serving Latin America and beyond.',
        abb: 'Avianca',
    },
    {
        id: 'azerbaijan-airlines',
        name: 'Azerbaijan Airlines',
        description: 'The flag carrier of Azerbaijan, connecting the country with destinations in Europe, Asia, and the Middle East.',
        abb: 'AZAL',
    },
    {
        id: 'british-airways',
        name: 'British Airways',
        description: 'The flag carrier of the United Kingdom, a major global airline with extensive international routes.',
        abb: 'British Airways',
    },
    {
        id: 'brussels-airlines',
        name: 'Brussels Airlines',
        description: 'The flag carrier of Belgium, connecting Brussels with European and African destinations.',
        abb: 'Brussels Airline',
    },
    {
        id: 'cathay-pacific',
        name: 'Cathay Pacific',
        description: 'The flag carrier of Hong Kong, a premium airline with a strong presence in Asia and long-haul routes.',
        abb: 'Cathay Pacific',
    },
    {
        id: 'copa-airlines',
        name: 'Copa Airlines',
        description: 'The flag carrier of Panama, with a hub in Panama City connecting North, Central, and South America.',
        abb: 'Copa',
    },
    {
        id: 'eurowings',
        name: 'Eurowings',
        description: 'A German low-cost airline, part of the Lufthansa Group, serving destinations across Europe.',
        abb: 'Eurowings',
    },
    {
        id: 'garuda-indonesia',
        name: 'Garuda Indonesia',
        description: 'The flag carrier of Indonesia, connecting the Indonesian archipelago and international destinations.',
        abb: 'Garuda Ind',
    },
    {
        id: 'kenya-airways',
        name: 'Kenya Airways',
        description: 'The flag carrier of Kenya, a major African airline with connections across the continent and beyond.',
        abb: 'Kenya Airways',
    },
    {
        id: 'klm',
        name: 'KLM Royal Dutch Airlines',
        description: 'The flag carrier of the Netherlands, part of the Air France-KLM group, with a global network.',
        abb: 'KLM',
    },
    {
        id: 'lufthansa',
        name: 'Lufthansa',
        description: 'The flag carrier of Germany and one of the largest airlines in Europe, with a vast global network.',
        abb: 'Lufthansa',
    },
    {
        id: 'malaysia-airlines',
        name: 'Malaysia Airlines',
        description: 'The flag carrier of Malaysia, connecting Southeast Asia and other international destinations.',
        abb: 'Malaysia Airline',
    },
    {
        id: 'oman-air',
        name: 'Oman Air',
        description: 'The flag carrier of Oman, with a growing network across the Middle East, Asia, and Europe.',
        abb: 'Oman Air',
    },
    {
        id: 'philippine-airlines',
        name: 'Philippine Airlines',
        description: 'The flag carrier of the Philippines, serving domestic and international routes across Asia, North America, and beyond.',
        abb: 'Philippine Air',
    },
    {
        id: 'qatar-airways',
        name: 'Qatar Airways',
        description: 'The flag carrier of Qatar, a globally renowned airline known for its service and extensive network from its Doha hub.',
        abb: 'Qatar Airways',
    },
    {
        id: 'riyadh-air',
        name: 'Riyadh Air',
        description: 'A new flag carrier of Saudi Arabia, poised to connect Riyadh with numerous international destinations.',
        abb: 'Riyadh Air',
    },
    {
        id: 'ryanair',
        name: 'Ryanair',
        description: 'An Irish ultra-low-cost carrier and one of the largest airlines in Europe by passenger numbers.',
        abb: 'Ryanair',
    },
    {
        id: 'singapore-airlines',
        name: 'Singapore Airlines',
        description: 'The flag carrier of Singapore, consistently ranked among the world\'s best airlines for service and quality.',
        abb: 'Singapore Air',
    },
    {
        id: 'starlux-airlines',
        name: 'Starlux Airlines',
        description: 'A Taiwanese airline known for its premium service and growing network in Asia and beyond.',
        abb: 'Starlux',
    },
    {
        id: 'swiss',
        name: 'Swiss International Air Lines',
        description: 'The flag carrier of Switzerland, part of the Lufthansa Group, known for its quality and efficiency.',
        abb: 'SWISS',
    },
    {
        id: 'transavia',
        name: 'Transavia',
        description: 'A Dutch low-cost airline, part of the Air France-KLM group, focusing on leisure travel within Europe.',
        abb: 'Transavia',
    },
    {
        id: 'turkish-airlines',
        name: 'Turkish Airlines',
        description: 'The flag carrier of Turkey, with an extensive network spanning Europe, Asia, Africa, and the Americas.',
        abb: 'Turkish Airlines',
    },
    {
        id: 'united-airlines',
        name: 'United Airlines',
        description: 'A major American airline with a large domestic and international route network.',
        abb: 'United',
    },
    {
        id: 'vietnam-airlines',
        name: 'Vietnam Airlines',
        description: 'The flag carrier of Vietnam, connecting the country with numerous destinations in Asia, Europe, and Australia.',
        abb: 'Vietnam Airlines',
    },
    {
        id: 'virgin-atlantic',
        name: 'Virgin Atlantic',
        description: 'A British airline known for its stylish service and long-haul routes connecting the UK with North America, the Caribbean, and Asia.',
        abb: 'Virgin Atlantic',
    },
    {
        id: 'westjet',
        name: 'WestJet',
        description: 'A Canadian airline, the second-largest in the country, offering scheduled and charter air service in North America, Central America, the Caribbean and Europe.',
        abb: 'WestJet',
    },
];





export default function AirlinesPage() {
    return (
        <>
            <Navbar selectedPage="airlines" />

            <div className="airlines-page">
                <div className="airlines-content">
                    <h1>Our Partner Airlines</h1>
                    <div className="airlines-grid">
                        {airlinesData.map((airline) => (
                            <div key={airline.id} className="airline-card">
                                <div className="airline-logo">
                                    <img src={`../airlines/logos/${airline.id}.svg`} alt={airline.name} />
                                </div>
                                <div className="airline-info">
                                    <h2>{airline.name}</h2>
                                    <p>{airline.description}</p>
                                </div>
                                <button className="fly-btn" onClick={() => window.location.href = "/search"}>
                                    <img src="../icons/takeoff_w.svg" alt="Takeoff" className="btn-icon" />
                                    Fly <span className="btn-text-long">{airline.abb}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />

        </>
    );
}
