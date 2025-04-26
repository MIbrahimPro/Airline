import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import ContactUs from './pages/Contact/contact';
import PrivacyPolicy from './pages/privacy/privacy';
import SearchResultsPage from './pages/searchresult/SearchResults';
import AirlinesPage from './pages/airlinepage/airlinepage';
import DealsPage from './pages/Deals/deals';
import LocationsPage from './pages/locations/locations';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/tickets" element={<SearchResultsPage />} />
        <Route path="/flight" element={<AirlinesPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/location" element={<LocationsPage/>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
