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
import ErrorPage from './pages/error/error';
import AboutPage from './pages/about/about';

import { GlobalStatusProvider } from './context/GlobalLoaderContext';
import GlobalLoader from './components/GlobalLoader/GlobalLoader';

import AdminLogin from './admin/pages/login/login';
import Dashboard from './admin/pages/dashboard/dashboard';
import ProtectedRoute from './admin/components/ProtectedRoute/ProtectedRoute';
import RegionsPage from './admin/pages/region/region';
import CountryPage from './admin/pages/country/country';
import AdminLocationsPage from './admin/pages/location/location';
import AirportsPage from './admin/pages/airports/airports';
import AdminAirlinesPage from './admin/pages/airlines/airlines';
import SiteInfoPage from './admin/pages/siteinfo/siteinfo';
import ChangePasswordPage from './admin/pages/changepassword/changepassword';
import FlightsPage from './admin/pages/flight/flight';
import ChangeEmailPage from './admin/components/changeemail/changeemail';
import FlightDetails from './admin/pages/flightdetail/flightdetail';
import ContactsPageAdmin from './admin/pages/contact/contactadmin';
import AirlineDetail from './pages/airlinedetail/airlinedetail';
import QuotesPage from './admin/pages/quote/quote';
import PrivacyPolicyEditor from './admin/pages/privacy/privacyadmin';
import FAQEditor from './admin/pages/FAQ/FAQadmin';

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
						<Route path="/flight/:id" element={<AirlineDetail />} />
						<Route path="/deals" element={<DealsPage />} />
						<Route path="/location" element={<LocationsPage />} />
						<Route path="/countries/:regionId" element={<CountriesPage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/error" element={<ErrorPage />} />

						<Route path="/admin/*" element={<ProtectedRoute />}>
							<Route path="regions" element={<RegionsPage />} />
							<Route path="country" element={<CountryPage />} />
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="locations" element={<AdminLocationsPage />} />
							<Route path="airline" element={<AdminAirlinesPage />} />
							<Route path="siteinfo" element={<SiteInfoPage />} />
							<Route path="airports" element={<AirportsPage />} />
							<Route path="contact" element={<ContactsPageAdmin />} />
							<Route path="quotes" element={<QuotesPage />} />
							<Route path="FAQ" element={<FAQEditor />} />
							<Route path="privacy" element={<PrivacyPolicyEditor />} />
							<Route path="flight" element={<FlightsPage />} />
							<Route path="flight/:id" element={<FlightDetails />} />
							<Route path="changeemail" element={<ChangeEmailPage />} />
							<Route path="changepassword" element={<ChangePasswordPage />} />
						</Route>


						
						<Route path="/admin" element={<AdminLogin />} />
						<Route path="*" element={<Home />} />


					</Routes>

				</GlobalStatusProvider>


			</Router>
		</div>
	);
}

export default App;

// Import other pages as needed


// <Route path="locations" element={<LocationsPage />} />
// <Route path="airports"  element={<AirportsPage  />} />