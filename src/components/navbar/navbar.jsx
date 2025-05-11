import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import axios from 'axios';
import './navbar.scss';
import Links from '../links/links';
import { FaGlobe, FaStar } from 'react-icons/fa';

const ANIMATION_DURATION = 600; // Animation duration in milliseconds

export default function Navbar({ selectedPage = null }) {

	const [regions, setregions] = useState([]);
	const [popular, setpopular] = useState([]);
	const [open, setOpen] = useState(false);
	const [renderDropdown, setRenderDropdown] = useState(false);
	const { startLoading, endLoading, setGlobalError } = useGlobalStatus();



	useEffect(() => {
		startLoading();
		axios
			.get('/api/region')
			.then((response) => {
				if (response.data) {
					setregions(response.data);
				} else {
					setGlobalError('Invalid response format.');
				}
			})
			.catch((err) => {
				console.error(err);
				setGlobalError(err.message || 'Error fetching data');
			})
			.finally(() => {
				endLoading();
			});

	}, [startLoading, endLoading, setGlobalError]);


	useEffect(() => {
		const fetchData = async () => {
			startLoading();

			try {
				const popularResponse = await axios.get('/api/location/popular');

				if (!popularResponse.data) {
					throw new Error('Invalid response from /api/location/popular');
				}

				const processedPopular = await Promise.all(
					popularResponse.data.map(async (location) => {
						try {
							const airportIdsResponse = await axios.get(
								`/api/airport/by-location/${location._id}/ids`
							);
							const airportIds = airportIdsResponse.data;
							const airport_id = airportIds.length > 0 ? airportIds[0] : null;
							return {
								name: location.name,
								id: location._id,
								airport_id: airport_id,
							};
						} catch (error) {
							console.error(
								`Error fetching airport IDs for location ${location._id}:`,
								error
							);
							return {
								name: location.name,
								id: location._id,
								airport_id: null,
							};
						}
					})
				);
				setpopular(processedPopular);
			} catch (error) {
				setGlobalError(error.message || 'Error fetching data');
			} finally {
				endLoading();
			}
		};

		fetchData();
	}, [startLoading, endLoading, setGlobalError]);


	useEffect(() => {
		if (open) {
			setRenderDropdown(true);
		} else {
			const timer = setTimeout(() => {
				setRenderDropdown(false);
			}, ANIMATION_DURATION);
			return () => clearTimeout(timer);
		}
	}, [open]);

	const toggleOpen = () => setOpen(o => !o);

	const navItems = [
		{ name: 'home', path: '/home' },
		{ name: 'flight', path: '/flight' }, // No path, triggers dropdown
		{ name: 'tickets', path: null },
		{ name: 'deals', path: '/deals' },
	];




	return (
		<div className="navbar-container">
			{open && <div className="dropdown-overlay" onClick={toggleOpen} />}


			<nav className={`navbar ${open ? 'expanded' : ''}`}>


				<div className="nav-row">
					{navItems.map(item => (
						<Links
							key={item.name}
							name={item.name}
							iconSrc={`../icons/${item.name}.svg`}
							selected={item.name === 'tickets' ? open : item.name === selectedPage}
							onClick={item.name === 'tickets' ? toggleOpen : undefined}
							as={item.path ? Link : undefined}
							to={item.path}
						/>
					))}
				</div>

				{renderDropdown && (
					<div className={`dropdown-wrapper ${open ? 'open' : ''}`}>
						<div className="dropdown-content">
							<div className="section">
								<h5><FaGlobe className="heading-icon" /> Regions</h5>
								<div className="pill-row">
									{regions.map((r, i) => (
										<Links key={i} name={r.name} smaller as={Link} to={"/countries/" + r._id} />
									))}
								</div>
							</div>
							<div className="section">
								<h5><FaStar className="heading-icon" /> Popular Destinations</h5>
								<div className="pill-row">
									{popular.map((p, i) => (
										<Links key={i} name={p.name} smaller as={Link} to={"/search?to_id=" + p.airport_id} />
									))}
								</div>
							</div>
						</div>
					</div>
				)}


			</nav>



		</div>
	);
}