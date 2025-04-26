import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.scss';
import Links from '../links/links';
import { FaGlobe, FaStar } from 'react-icons/fa';

const continents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
const popular = ['Paris', 'Tokyo', 'New York', 'Sydney', 'Rio de Janeiro', 'Cape'];
const ANIMATION_DURATION = 600; // Animation duration in milliseconds

export default function Navbar({ selectedPage = null }) {
	const [open, setOpen] = useState(false);
	const [renderDropdown, setRenderDropdown] = useState(false);

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
		{ name: 'flight', path: null }, // No path, triggers dropdown
		{ name: 'tickets', path: '/tickets' },
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
							selected={item.name === 'flight' ? open : item.name === selectedPage}
							onClick={item.name === 'flight' ? toggleOpen : undefined}
							as={item.path ? Link : undefined}
							to={item.path}
						/>
					))}
				</div>

				{renderDropdown && (
					<div className={`dropdown-wrapper ${open ? 'open' : ''}`}>
						<div className="dropdown-content">
							<div className="section">
								<h5><FaGlobe className="heading-icon" /> Continents</h5>
								<div className="pill-row">
									{continents.map((c, i) => (
										<Links key={i} name={c} smaller />
									))}
								</div>
							</div>
							<div className="section">
								<h5><FaStar className="heading-icon" /> Popular</h5>
								<div className="pill-row">
									{popular.map((p, i) => (
										<Links key={i} name={p} smaller />
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