import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import ContactUs from './pages/Contact/contact';
import PrivacyPolicy from './pages/privacy/privacy';
import SearchResultsPage from './pages/searchresult/SearchResults';
import AirlinesPage from './pages/airlinepage/airlinepage';
import DealsPage from './pages/Deals/deals';
import LocationsPage from './pages/locations/locations';
import CountriesPage from './pages/countries/countries';
import React from 'react';
import { GlobalStatusProvider } from './context/GlobalLoaderContext';
import GlobalLoader from './components/GlobalLoader/GlobalLoader';
import ErrorPage from './pages/error/error';
import AboutPage from './pages/about/about';


function App() {
	return (
		<div className="App">
			<Router>


				<GlobalStatusProvider>
					<GlobalLoader />

					<Routes>
						<Route path="/contact" element={<ContactUs />} />
						<Route path="/privacy" element={<PrivacyPolicy />} />
						<Route path="/search" element={<SearchResultsPage />} />
						<Route path="/search-results" element={<SearchResultsPage />} />
						<Route path="/tickets" element={<SearchResultsPage />} />
						<Route path="/flight" element={<AirlinesPage />} />
						<Route path="/deals" element={<DealsPage />} />
						<Route path="/location" element={<LocationsPage />} />
						<Route path="/countries/:regionId" element={<CountriesPage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/error" element={<ErrorPage />} />
						<Route path="*" element={<Home />} />
					</Routes>

				</GlobalStatusProvider>


			</Router>
		</div>
	);
}

export default App;

// Import other pages as needed

