import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
// import Dashboard from './pages/dasboard/dashboard';
import ContactUs from './pages/Contact/contact';
import PrivacyPolicy from './pages/privacy/privacy';
import SearchResultsPage from './pages/searchresult/SearchResults';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
