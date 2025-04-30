import React, { useState,useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Navbar from "../../components/navbar/navbar"
import Footer from "../../components/footer/footer";
import FilterSidebar from '../../components/filtersidebar/FilterSidebar';
import FlightCard from '../../components/TicketCard/TicketCard';
import FilterSidebarModal from '../../components/filtersidebar/FilterSidebarModal';
import SearchForm from '../../components/filter/filter';


import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import axios from 'axios';

import './searchResults.scss';



// const tickets = [
// 	{
// 	  "id": 1,
// 	  "recommended": true,
// 	  "airlineLogo": "qatar-airways",
// 	  "airlineName": "Qatar Airways",
// 	  "deptTime": "02:45 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "5h 15m",
// 	  "stops": 0,
// 	  "arrivalPort": "DOH",
// 	  "arrivalPortFull": "Hamad International Airport, Doha",
// 	  "saving": 7500,
// 	  "price": 85000
// 	},
// 	{
// 	  "id": 2,
// 	  "recommended": false,
// 	  "airlineLogo": "turkish-airlines",
// 	  "airlineName": "Turkish Airlines",
// 	  "deptTime": "11:20 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "8h 40m",
// 	  "stops": 1,
// 	  "arrivalPort": "IST",
// 	  "arrivalPortFull": "Istanbul Airport",
// 	  "saving": 0,
// 	  "price": 120000
// 	},
// 	{
// 	  "id": 3,
// 	  "recommended": true,
// 	  "airlineLogo": "emirates",
// 	  "airlineName": "Emirates",
// 	  "deptTime": "07:00 am",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "4h 30m",
// 	  "stops": 0,
// 	  "arrivalPort": "DXB",
// 	  "arrivalPortFull": "Dubai International Airport",
// 	  "saving": 12000,
// 	  "price": 98000
// 	},
// 	{
// 	  "id": 4,
// 	  "recommended": false,
// 	  "airlineLogo": "british-airways",
// 	  "airlineName": "British Airways",
// 	  "deptTime": "09:10 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "12h 55m",
// 	  "stops": 1,
// 	  "arrivalPort": "LHR",
// 	  "arrivalPortFull": "Heathrow Airport, London",
// 	  "saving": 0,
// 	  "price": 185000
// 	},
// 	{
// 	  "id": 5,
// 	  "recommended": true,
// 	  "airlineLogo": "singapore-airlines",
// 	  "airlineName": "Singapore Airlines",
// 	  "deptTime": "01:35 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "10h 20m",
// 	  "stops": 1,
// 	  "arrivalPort": "SIN",
// 	  "arrivalPortFull": "Changi Airport, Singapore",
// 	  "saving": 15000,
// 	  "price": 165000
// 	},
// 	{
// 	  "id": 6,
// 	  "recommended": false,
// 	  "airlineLogo": "air-canada",
// 	  "airlineName": "Air Canada",
// 	  "deptTime": "06:00 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "15h 0m",
// 	  "stops": 2,
// 	  "arrivalPort": "YYZ",
// 	  "arrivalPortFull": "Toronto Pearson International Airport",
// 	  "saving": 0,
// 	  "price": 250000
// 	},
// 	{
// 	  "id": 7,
// 	  "recommended": true,
// 	  "airlineLogo": "lufthansa",
// 	  "airlineName": "Lufthansa",
// 	  "deptTime": "03:15 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "9h 30m",
// 	  "stops": 1,
// 	  "arrivalPort": "FRA",
// 	  "arrivalPortFull": "Frankfurt Airport",
// 	  "saving": 9000,
// 	  "price": 135000
// 	},
// 	{
// 	  "id": 8,
// 	  "recommended": false,
// 	  "airlineLogo": "cathay-pacific",
// 	  "airlineName": "Cathay Pacific",
// 	  "deptTime": "10:40 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "7h 10m",
// 	  "stops": 1,
// 	  "arrivalPort": "KUL",
// 	  "arrivalPortFull": "Kuala Lumpur International Airport",
// 	  "saving": 0,
// 	  "price": 110000
// 	},
// 	{
// 	  "id": 9,
// 	  "recommended": true,
// 	  "airlineLogo": "united-airlines",
// 	  "airlineName": "United Airlines",
// 	  "deptTime": "08:55 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "16h 45m",
// 	  "stops": 2,
// 	  "arrivalPort": "JFK",
// 	  "arrivalPortFull": "John F. Kennedy International Airport, New York",
// 	  "saving": 18000,
// 	  "price": 280000
// 	},
// 	{
// 	  "id": 10,
// 	  "recommended": false,
// 	  "airlineLogo": "air-france",
// 	  "airlineName": "Air France",
// 	  "deptTime": "05:00 am",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "11h 0m",
// 	  "stops": 1,
// 	  "arrivalPort": "CDG",
// 	  "arrivalPortFull": "Charles de Gaulle Airport, Paris",
// 	  "saving": 0,
// 	  "price": 170000
// 	},
// 	{
// 	  "id": 11,
// 	  "recommended": true,
// 	  "airlineLogo": "malaysia-airlines",
// 	  "airlineName": "Malaysia Airlines",
// 	  "deptTime": "02:10 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "6h 50m",
// 	  "stops": 0,
// 	  "arrivalPort": "KUL",
// 	  "arrivalPortFull": "Kuala Lumpur International Airport",
// 	  "saving": 6000,
// 	  "price": 95000
// 	},
// 	{
// 	  "id": 12,
// 	  "recommended": false,
// 	  "airlineLogo": "virgin-atlantic",
// 	  "airlineName": "Virgin Atlantic",
// 	  "deptTime": "04:30 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "13h 15m",
// 	  "stops": 1,
// 	  "arrivalPort": "LHR",
// 	  "arrivalPortFull": "Heathrow Airport, London",
// 	  "saving": 0,
// 	  "price": 195000
// 	},
// 	{
// 	  "id": 13,
// 	  "recommended": true,
// 	  "airlineLogo": "qatar-airways",
// 	  "airlineName": "Qatar Airways",
// 	  "deptTime": "09:05 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "5h 30m",
// 	  "stops": 0,
// 	  "arrivalPort": "DOH",
// 	  "arrivalPortFull": "Hamad International Airport, Doha",
// 	  "saving": 8000,
// 	  "price": 90000
// 	},
// 	{
// 	  "id": 14,
// 	  "recommended": false,
// 	  "airlineLogo": "swiss",
// 	  "airlineName": "Swiss",
// 	  "deptTime": "11:50 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "10h 5m",
// 	  "stops": 1,
// 	  "arrivalPort": "FRA",
// 	  "arrivalPortFull": "Frankfurt Airport",
// 	  "saving": 0,
// 	  "price": 145000
// 	},
// 	{
// 	  "id": 15,
// 	  "recommended": true,
// 	  "airlineLogo": "emirates",
// 	  "airlineName": "Emirates",
// 	  "deptTime": "03:40 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "4h 15m",
// 	  "stops": 0,
// 	  "arrivalPort": "DXB",
// 	  "arrivalPortFull": "Dubai International Airport",
// 	  "saving": 10000,
// 	  "price": 92000
// 	},
// 	{
// 	  "id": 16,
// 	  "recommended": false,
// 	  "airlineLogo": "air-india",
// 	  "airlineName": "Air India",
// 	  "deptTime": "07:25 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "3h 5m",
// 	  "stops": 0,
// 	  "arrivalPort": "DEL",
// 	  "arrivalPortFull": "Indira Gandhi International Airport, Delhi",
// 	  "saving": 0,
// 	  "price": 45000
// 	},
// 	{
// 	  "id": 17,
// 	  "recommended": true,
// 	  "airlineLogo": "singapore-airlines",
// 	  "airlineName": "Singapore Airlines",
// 	  "deptTime": "01:00 am",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "10h 0m",
// 	  "stops": 1,
// 	  "arrivalPort": "SIN",
// 	  "arrivalPortFull": "Changi Airport, Singapore",
// 	  "saving": 14000,
// 	  "price": 168000
// 	},
// 	{
// 	  "id": 18,
// 	  "recommended": false,
// 	  "airlineLogo": "air-transat",
// 	  "airlineName": "Air Transat",
// 	  "deptTime": "05:45 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "16h 30m",
// 	  "stops": 2,
// 	  "arrivalPort": "YYZ",
// 	  "arrivalPortFull": "Toronto Pearson International Airport",
// 	  "saving": 0,
// 	  "price": 260000
// 	},
// 	{
// 	  "id": 19,
// 	  "recommended": true,
// 	  "airlineLogo": "lufthansa",
// 	  "airlineName": "Lufthansa",
// 	  "deptTime": "03:00 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "9h 15m",
// 	  "stops": 1,
// 	  "arrivalPort": "FRA",
// 	  "arrivalPortFull": "Frankfurt Airport",
// 	  "saving": 8500,
// 	  "price": 138000
// 	},
// 	{
// 	  "id": 20,
// 	  "recommended": false,
// 	  "airlineLogo": "copa-airlines",
// 	  "airlineName": "Copa Airlines",
// 	  "deptTime": "10:00 am",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "18h 0m",
// 	  "stops": 2,
// 	  "arrivalPort": "JFK",
// 	  "arrivalPortFull": "John F. Kennedy International Airport, New York",
// 	  "saving": 0,
// 	  "price": 300000
// 	},
// 	{
// 	  "id": 21,
// 	  "recommended": true,
// 	  "airlineLogo": "malaysia-airlines",
// 	  "airlineName": "Malaysia Airlines",
// 	  "deptTime": "02:50 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "6h 30m",
// 	  "stops": 0,
// 	  "arrivalPort": "KUL",
// 	  "arrivalPortFull": "Kuala Lumpur International Airport",
// 	  "saving": 7000,
// 	  "price": 93000
// 	},
// 	{
// 	  "id": 22,
// 	  "recommended": false,
// 	  "airlineLogo": "vietnam-airlines",
// 	  "airlineName": "Vietnam Airlines",
// 	  "deptTime": "04:00 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "8h 50m",
// 	  "stops": 1,
// 	  "arrivalPort": "BKK",
// 	  "arrivalPortFull": "Suvarnabhumi Airport, Bangkok",
// 	  "saving": 0,
// 	  "price": 125000
// 	},
// 	{
// 	  "id": 23,
// 	  "recommended": true,
// 	  "airlineLogo": "qatar-airways",
// 	  "airlineName": "Qatar Airways",
// 	  "deptTime": "09:30 am",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "5h 0m",
// 	  "stops": 0,
// 	  "arrivalPort": "DOH",
// 	  "arrivalPortFull": "Hamad International Airport, Doha",
// 	  "saving": 7000,
// 	  "price": 88000
// 	},
// 	{
// 	  "id": 24,
// 	  "recommended": false,
// 	  "airlineLogo": "british-airways",
// 	  "airlineName": "British Airways",
// 	  "deptTime": "11:00 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "12h 30m",
// 	  "stops": 1,
// 	  "arrivalPort": "LHR",
// 	  "arrivalPortFull": "Heathrow Airport, London",
// 	  "saving": 0,
// 	  "price": 190000
// 	},
// 	{
// 	  "id": 25,
// 	  "recommended": true,
// 	  "airlineLogo": "emirates",
// 	  "airlineName": "Emirates",
// 	  "deptTime": "03:00 am",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "4h 0m",
// 	  "stops": 0,
// 	  "arrivalPort": "DXB",
// 	  "arrivalPortFull": "Dubai International Airport",
// 	  "saving": 11000,
// 	  "price": 90000
// 	},
// 	{
// 	  "id": 26,
// 	  "recommended": false,
// 	  "airlineLogo": "air-new-zealand",
// 	  "airlineName": "Air New Zealand",
// 	  "deptTime": "07:00 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "20h 0m",
// 	  "stops": 2,
// 	  "arrivalPort": "SYD",
// 	  "arrivalPortFull": "Sydney Airport",
// 	  "saving": 0,
// 	  "price": 350000
// 	},
// 	{
// 	  "id": 27,
// 	  "recommended": true,
// 	  "airlineLogo": "lufthansa",
// 	  "airlineName": "Lufthansa",
// 	  "deptTime": "03:30 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "9h 0m",
// 	  "stops": 1,
// 	  "arrivalPort": "FRA",
// 	  "arrivalPortFull": "Frankfurt Airport",
// 	  "saving": 8000,
// 	  "price": 140000
// 	},
// 	{
// 	  "id": 28,
// 	  "recommended": false,
// 	  "airlineLogo": "singapore-airlines",
// 	  "airlineName": "Singapore Airlines",
// 	  "deptTime": "10:30 am",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "10h 10m",
// 	  "stops": 1,
// 	  "arrivalPort": "SIN",
// 	  "arrivalPortFull": "Changi Airport, Singapore",
// 	  "saving": 0,
// 	  "price": 175000
// 	},
// 	{
// 	  "id": 29,
// 	  "recommended": true,
// 	  "airlineLogo": "united-airlines",
// 	  "airlineName": "United Airlines",
// 	  "deptTime": "08:00 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "17h 0m",
// 	  "stops": 2,
// 	  "arrivalPort": "JFK",
// 	  "arrivalPortFull": "John F. Kennedy International Airport, New York",
// 	  "saving": 20000,
// 	  "price": 270000
// 	},
// 	{
// 	  "id": 30,
// 	  "recommended": false,
// 	  "airlineLogo": "air-france",
// 	  "airlineName": "Air France",
// 	  "deptTime": "05:30 am",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "10h 45m",
// 	  "stops": 1,
// 	  "arrivalPort": "CDG",
// 	  "arrivalPortFull": "Charles de Gaulle Airport, Paris",
// 	  "saving": 0,
// 	  "price": 172000
// 	},
// 	{
// 	  "id": 31,
// 	  "recommended": true,
// 	  "airlineLogo": "malaysia-airlines",
// 	  "airlineName": "Malaysia Airlines",
// 	  "deptTime": "02:00 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "6h 45m",
// 	  "stops": 0,
// 	  "arrivalPort": "KUL",
// 	  "arrivalPortFull": "Kuala Lumpur International Airport",
// 	  "saving": 6500,
// 	  "price": 94000
// 	},
// 	{
// 	  "id": 32,
// 	  "recommended": false,
// 	  "airlineLogo": "virgin-atlantic",
// 	  "airlineName": "Virgin Atlantic",
// 	  "deptTime": "04:00 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "13h 0m",
// 	  "stops": 1,
// 	  "arrivalPort": "LHR",
// 	  "arrivalPortFull": "Heathrow Airport, London",
// 	  "saving": 0,
// 	  "price": 198000
// 	},
// 	{
// 	  "id": 33,
// 	  "recommended": true,
// 	  "airlineLogo": "qatar-airways",
// 	  "airlineName": "Qatar Airways",
// 	  "deptTime": "09:00 am",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "5h 20m",
// 	  "stops": 0,
// 	  "arrivalPort": "DOH",
// 	  "arrivalPortFull": "Hamad International Airport, Doha",
// 	  "saving": 7800,
// 	  "price": 86000
// 	},
// 	{
// 	  "id": 34,
// 	  "recommended": false,
// 	  "airlineLogo": "swiss",
// 	  "airlineName": "Swiss",
// 	  "deptTime": "11:30 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "10h 0m",
// 	  "stops": 1,
// 	  "arrivalPort": "FRA",
// 	  "arrivalPortFull": "Frankfurt Airport",
// 	  "saving": 0,
// 	  "price": 148000
// 	},
// 	{
// 	  "id": 35,
// 	  "recommended": true,
// 	  "airlineLogo": "emirates",
// 	  "airlineName": "Emirates",
// 	  "deptTime": "03:20 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "4h 25m",
// 	  "stops": 0,
// 	  "arrivalPort": "DXB",
// 	  "arrivalPortFull": "Dubai International Airport",
// 	  "saving": 10500,
// 	  "price": 91000
// 	},
// 	{
// 	  "id": 36,
// 	  "recommended": false,
// 	  "airlineLogo": "air-india",
// 	  "airlineName": "Air India",
// 	  "deptTime": "07:00 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "3h 10m",
// 	  "stops": 0,
// 	  "arrivalPort": "DEL",
// 	  "arrivalPortFull": "Indira Gandhi International Airport, Delhi",
// 	  "saving": 0,
// 	  "price": 46000
// 	},
// 	{
// 	  "id": 37,
// 	  "recommended": true,
// 	  "airlineLogo": "singapore-airlines",
// 	  "airlineName": "Singapore Airlines",
// 	  "deptTime": "01:15 am",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "10h 15m",
// 	  "stops": 1,
// 	  "arrivalPort": "SIN",
// 	  "arrivalPortFull": "Changi Airport, Singapore",
// 	  "saving": 15500,
// 	  "price": 166000
// 	},
// 	{
// 	  "id": 38,
// 	  "recommended": false,
// 	  "airlineLogo": "air-transat",
// 	  "airlineName": "Air Transat",
// 	  "deptTime": "05:00 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "16h 0m",
// 	  "stops": 2,
// 	  "arrivalPort": "YYZ",
// 	  "arrivalPortFull": "Toronto Pearson International Airport",
// 	  "saving": 0,
// 	  "price": 265000
// 	},
// 	{
// 	  "id": 39,
// 	  "recommended": true,
// 	  "airlineLogo": "lufthansa",
// 	  "airlineName": "Lufthansa",
// 	  "deptTime": "03:45 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "9h 30m",
// 	  "stops": 1,
// 	  "arrivalPort": "FRA",
// 	  "arrivalPortFull": "Frankfurt Airport",
// 	  "saving": 9500,
// 	  "price": 136000
// 	},
// 	{
// 	  "id": 40,
// 	  "recommended": false,
// 	  "airlineLogo": "copa-airlines",
// 	  "airlineName": "Copa Airlines",
// 	  "deptTime": "10:15 am",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "17h 30m",
// 	  "stops": 2,
// 	  "arrivalPort": "JFK",
// 	  "arrivalPortFull": "John F. Kennedy International Airport, New York",
// 	  "saving": 0,
// 	  "price": 305000
// 	},
// 	{
// 	  "id": 41,
// 	  "recommended": true,
// 	  "airlineLogo": "malaysia-airlines",
// 	  "airlineName": "Malaysia Airlines",
// 	  "deptTime": "02:30 pm",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "6h 20m",
// 	  "stops": 0,
// 	  "arrivalPort": "KUL",
// 	  "arrivalPortFull": "Kuala Lumpur International Airport",
// 	  "saving": 7200,
// 	  "price": 92800
// 	},
// 	{
// 	  "id": 42,
// 	  "recommended": false,
// 	  "airlineLogo": "vietnam-airlines",
// 	  "airlineName": "Vietnam Airlines",
// 	  "deptTime": "04:15 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "8h 40m",
// 	  "stops": 1,
// 	  "arrivalPort": "BKK",
// 	  "arrivalPortFull": "Suvarnabhumi Airport, Bangkok",
// 	  "saving": 0,
// 	  "price": 128000
// 	},
// 	{
// 	  "id": 43,
// 	  "recommended": true,
// 	  "airlineLogo": "qatar-airways",
// 	  "airlineName": "Qatar Airways",
// 	  "deptTime": "09:45 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "5h 10m",
// 	  "stops": 0,
// 	  "arrivalPort": "DOH",
// 	  "arrivalPortFull": "Hamad International Airport, Doha",
// 	  "saving": 7300,
// 	  "price": 87000
// 	},
// 	{
// 	  "id": 44,
// 	  "recommended": false,
// 	  "airlineLogo": "british-airways",
// 	  "airlineName": "British Airways",
// 	  "deptTime": "11:15 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "12h 45m",
// 	  "stops": 1,
// 	  "arrivalPort": "LHR",
// 	  "arrivalPortFull": "Heathrow Airport, London",
// 	  "saving": 0,
// 	  "price": 192000
// 	},
// 	{
// 	  "id": 45,
// 	  "recommended": true,
// 	  "airlineLogo": "emirates",
// 	  "airlineName": "Emirates",
// 	  "deptTime": "03:10 am",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "4h 5m",
// 	  "stops": 0,
// 	  "arrivalPort": "DXB",
// 	  "arrivalPortFull": "Dubai International Airport",
// 	  "saving": 11500,
// 	  "price": 89500
// 	},
// 	{
// 	  "id": 46,
// 	  "recommended": false,
// 	  "airlineLogo": "air-new-zealand",
// 	  "airlineName": "Air New Zealand",
// 	  "deptTime": "07:30 am",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "20h 30m",
// 	  "stops": 2,
// 	  "arrivalPort": "SYD",
// 	  "arrivalPortFull": "Sydney Airport",
// 	  "saving": 0,
// 	  "price": 355000
// 	},
// 	{
// 	  "id": 47,
// 	  "recommended": true,
// 	  "airlineLogo": "lufthansa",
// 	  "airlineName": "Lufthansa",
// 	  "deptTime": "03:50 pm",
// 	  "deptPort": "KHI",
// 	  "deptPortFull": "Jinnah International Airport, Karachi",
// 	  "flightTime": "9h 10m",
// 	  "stops": 1,
// 	  "arrivalPort": "FRA",
// 	  "arrivalPortFull": "Frankfurt Airport",
// 	  "saving": 8800,
// 	  "price": 137000
// 	},
// 	{
// 	  "id": 48,
// 	  "recommended": false,
// 	  "airlineLogo": "singapore-airlines",
// 	  "airlineName": "Singapore Airlines",
// 	  "deptTime": "10:00 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "10h 0m",
// 	  "stops": 1,
// 	  "arrivalPort": "SIN",
// 	  "arrivalPortFull": "Changi Airport, Singapore",
// 	  "saving": 0,
// 	  "price": 178000
// 	},
// 	{
// 	  "id": 49,
// 	  "recommended": true,
// 	  "airlineLogo": "united-airlines",
// 	  "airlineName": "United Airlines",
// 	  "deptTime": "08:30 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "16h 50m",
// 	  "stops": 2,
// 	  "arrivalPort": "JFK",
// 	  "arrivalPortFull": "John F. Kennedy International Airport, New York",
// 	  "saving": 19000,
// 	  "price": 275000
// 	},
// 	{
// 	  "id": 50,
// 	  "recommended": false,
// 	  "airlineLogo": "air-france",
// 	  "airlineName": "Air France",
// 	  "deptTime": "05:00 am",
// 	  "deptPort": "LHE",
// 	  "deptPortFull": "Allama Iqbal International Airport, Lahore",
// 	  "flightTime": "10h 30m",
// 	  "stops": 1,
// 	  "arrivalPort": "CDG",
// 	  "arrivalPortFull": "Charles de Gaulle Airport, Paris",
// 	  "saving": 0,
// 	  "price": 174000
// 	},
// 	{
// 	  "id": 51,
// 	  "recommended": true,
// 	  "airlineLogo": "malaysia-airlines",
// 	  "airlineName": "Malaysia Airlines",
// 	  "deptTime": "02:40 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "6h 10m",
// 	  "stops": 0,
// 	  "arrivalPort": "KUL",
// 	  "arrivalPortFull": "Kuala Lumpur International Airport",
// 	  "saving": 6800,
// 	  "price": 93200
// 	},
// 	{
// 	  "id": 52,
// 	  "recommended": false,
// 	  "airlineLogo": "virgin-atlantic",
// 	  "airlineName": "Virgin Atlantic",
// 	  "deptTime": "04:20 pm",
// 	  "deptPort": "ISB",
// 	  "deptPortFull": "Islamabad International Airport",
// 	  "flightTime": "13h 20m",
// 	  "stops": 1,
// 	  "arrivalPort": "LHR",
// 	  "arrivalPortFull": "Heathrow Airport, London",
// 	  "saving": 0,
// 	  "price": 196000
// 	}
//   ];
  


// export default function SearchResultsPage() {
// 	const [showFilterModal, setShowFilterModal] = useState(false);
// 	const [showSearchPopup, setShowSearchPopup] = useState(false);
// 	const [tickets, settickets] = useState([]);
// 	const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

// 	useEffect(() => {
// 		startLoading();
// 		axios
// 			.get('/api/flight/page/60')
// 			.then((response) => {
// 				if (response.data) {
// 					settickets(response.data.data);
// 					console.log(response.data.data);
// 				} else {
// 					setGlobalError('Invalid response format.');
// 				}
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 				setGlobalError(err.message || 'Error fetching data');
// 			})
// 			.finally(() => {
// 				endLoading();
// 			});

// 	}, []);

// 	const handleSearchSubmit = (data) => {
// 		console.log('Search submitted:', data);
// 	};

// 	return (
// 		<>
// 			<Navbar />
// 			<div className="results-page">
// 				<aside className="filter-sidebar">
// 					<FilterSidebar />
// 				</aside>

// 				<main className="results-main">

// 					<div className="desktop-search-form">
// 						<SearchForm inline onSubmit={handleSearchSubmit} />
// 					</div>

// 					<div className='res-btns-cont'>
// 						<button
// 							className="mobile-filter-btn"
// 							onClick={() => setShowFilterModal(true)}
// 						>
// 							<img src='../icons/filter.svg' alt='' />

// 							<p>Filter</p>
// 						</button>
// 						<div
// 							className="mobile-search-btn"
// 							onClick={() => setShowSearchPopup(true)}
// 						>
// 							<span className="btn-text">Search Flights</span>
// 							<img className="btn-icon" src="../icons/search.svg" alt="search" />
// 						</div>
// 					</div>


// 					<div className="tickets-list">
// 						{tickets.map((ticket) => (
// 							<FlightCard
// 								key={ticket._id}
// 								recommended={true}
// 								airlineLogo={ticket.airline.monogramPicture}
// 								airlineName={ticket.airline.shortName}
// 								deptPort={ticket.departureAirport.code}
// 								deptPortFull={ticket.departureAirport.name}
// 								flightTime={ticket.time.hours + "h " + ticket.time.minutes + "m"}
// 								arrivalPort={ticket.arrivalAirport.code}
// 								arrivalPortFull={ticket.arrivalAirport.name}
// 								saving={ticket.prices[0].discount.roundTrip}
// 								price={ticket.prices[0].roundTrip - ticket.prices[0].discount.roundTrip}
// 							/>
// 						))}
// 					</div>
// 				</main>
// 			</div>
// 			<Footer />

// 			{showFilterModal && (
// 				<FilterSidebarModal onClose={() => setShowFilterModal(false)} />
// 			)}

// 			{showSearchPopup && (
// 				<SearchForm
// 					visible={showSearchPopup}
// 					onClose={() => setShowSearchPopup(false)}
// 					onSubmit={handleSearchSubmit}
// 				/>
// 			)}
// 		</>
// 	);
// }




export default function SearchResultsPage() {
    const [filters, setFilters] = useState({
        type: 'round-trip',
        from: '',
        to: '',
        date: '',
        airlines: [],
        minPrice: null,
        maxPrice: null,
        page: 1,
    });
    const [tickets, setTickets] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const { setGlobalError } = useGlobalStatus();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize filters from URL query parameters on mount
    useEffect(() => {
        const type = searchParams.get('type') || 'round-trip';
        const from = searchParams.get('from') || '';
        const to = searchParams.get('to') || '';
        const date = searchParams.get('date') || '';
        const airlines = searchParams.get('airlines') ? searchParams.get('airlines').split(',') : [];
        const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
        const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
        const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
        setFilters({ type, from, to, date, airlines, minPrice, maxPrice, page });
    }, [searchParams]);

    // Fetch flight data when filters change
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const params = {
                type: filters.type,
                from: filters.from,
                to: filters.to,
                date: filters.date,
                airlines: filters.airlines.length > 0 ? filters.airlines.join(',') : undefined,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                page: filters.page,
            };
            // Remove undefined or null parameters
            Object.keys(params).forEach(key => params[key] == null && delete params[key]);
            try {
                const response = await axios.get('/api/flight/filter', { params });
                setTickets(response.data.results);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error(err);
                setGlobalError(err.response?.data?.message || 'Error fetching flights.');
                setTickets([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [filters]);

    // Update URL query parameters when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.type !== 'round-trip') params.set('type', filters.type);
        if (filters.from) params.set('from', filters.from);
        if (filters.to) params.set('to', filters.to);
        if (filters.date) params.set('date', filters.date);
        if (filters.airlines.length > 0) params.set('airlines', filters.airlines.join(','));
        if (filters.minPrice != null) params.set('minPrice', filters.minPrice.toString());
        if (filters.maxPrice != null) params.set('maxPrice', filters.maxPrice.toString());
        if (filters.page !== 1) params.set('page', filters.page.toString());
        setSearchParams(params);
    }, [filters, setSearchParams]);

    const handleSearchSubmit = (data) => {
        const newFilters = {
            type: data.tripType === 'return' ? 'round-trip' : 'one-way',
            from: data.from,
            to: data.to,
            date: data.depart ? new Date(data.depart).toLocaleDateString('en-GB') : '',
            airlines: data.airline ? data.airline.split(',').map(a => a.trim()) : filters.airlines,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            page: 1, // Reset to page 1 on new search
        };
        setFilters(newFilters);
    };

    return (
        <>
            <Navbar />
            <div className="results-page">
                <aside className="filter-sidebar">
                    <FilterSidebar
                        minPrice={filters.minPrice}
                        setMinPrice={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
                        maxPrice={filters.maxPrice}
                        setMaxPrice={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
                        selectedAirlines={filters.airlines}
                        setSelectedAirlines={(airlines) => setFilters(prev => ({ ...prev, airlines }))}
                    />
                </aside>
                <main className="results-main">
                    <div className="desktop-search-form">
                        <SearchForm inline onSubmit={handleSearchSubmit} />
                    </div>
                    <div className="res-btns-cont">
                        <button
                            className="mobile-filter-btn"
                            onClick={() => setShowFilterModal(true)}
                        >
                            <img src="../icons/filter.svg" alt="" />
                            <p>Filter</p>
                        </button>
                        <div
                            className="mobile-search-btn"
                            onClick={() => setShowSearchPopup(true)}
                        >
                            <span className="btn-text">Search Flights</span>
                            <img className="btn-icon" src="../icons/search.svg" alt="search" />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="tickets-loader">Loading flights...</div>
                    ) : tickets.length > 0 ? (
                        <div className="tickets-list">
                            {tickets.map((ticket) => (
                                <FlightCard
                                    key={ticket.flightId}
                                    recommended={ticket.recommended}
                                    airlineLogo={ticket.airlineMono}
                                    airlineName={ticket.airlineName}
                                    deptPort={ticket.depAirportCode}
                                    deptPortFull={ticket.depAirportName}
                                    flightTime={ticket.flightTime}
                                    arrivalPort={ticket.arrAirportCode}
                                    arrivalPortFull={ticket.arrAirportName}
                                    saving={ticket.discount}
                                    price={ticket.finalPrice}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No flights found matching the criteria.</p>
                    )}
                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                                    className={filters.page === pageNum ? 'active' : ''}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
            {showFilterModal && (
                <FilterSidebarModal
                    onClose={() => setShowFilterModal(false)}
                    minPrice={filters.minPrice}
                    setMinPrice={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
                    maxPrice={filters.maxPrice}
                    setMaxPrice={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
                    selectedAirlines={filters.airlines}
                    setSelectedAirlines={(airlines) => setFilters(prev => ({ ...prev, airlines }))}
                />
            )}
            {showSearchPopup && (
                <SearchForm
                    visible={showSearchPopup}
                    onClose={() => setShowSearchPopup(false)}
                    onSubmit={handleSearchSubmit}
                />
            )}
        </>
    );
}