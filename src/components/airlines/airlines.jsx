import React, { useEffect, useRef, useState } from 'react';
import './airlines.scss';
import axios from 'axios';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';




export default function Airlines() {
	const containerRef = useRef(null);
	const [airlineList, setAirlineList] = useState([]);
	const [items, setItems] = useState([]);
	const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

	useEffect(() => {
		startLoading();
		axios
			.get('/api/airline/')
			.then((response) => {
				if (Array.isArray(response.data)) {
					setAirlineList(response.data);
				} else {
					setGlobalError('Invalid airline data received.');
				}
			})
			.catch((err) => {
				setGlobalError(
					err.response?.data?.message || err.message || 'Error fetching airlines.'
				);
			})
			.finally(() => {
				endLoading();
			});
	}, []);


	useEffect(() => {
		if (airlineList.length === 0) return;
		const computeItems = () => {
			const container = containerRef.current;
			if (!container) return;
			const gap = 40; // Gap between logos in px
			const logoWidth = 120; // Assumed width for each logo
			const singleSetWidth = airlineList.length * (logoWidth + gap);
			const needed = Math.ceil((container.clientWidth * 2) / singleSetWidth);
			const repeats = Math.max(needed, 2);
			const arr = Array.from({ length: repeats }).flatMap(() => airlineList);
			setItems(arr);
		};

		computeItems();
		window.addEventListener('resize', computeItems);
		return () => window.removeEventListener('resize', computeItems);
	}, [airlineList]);



	useEffect(() => {
		const container = containerRef.current;
		if (!container || items.length === 0) return;
		let frameId;
		const speed = 0.5; // pixels per frame
		const step = () => {
			container.scrollLeft += speed;
			// Calculate width of one repetition (assume uniform width)
			const gap = 40;
			const logoWidth = 120;
			const singleSetWidth = airlineList.length * (logoWidth + gap);
			if (container.scrollLeft >= singleSetWidth) {
				container.scrollLeft -= singleSetWidth;
			}
			frameId = requestAnimationFrame(step);
		};
		frameId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frameId);
	}, [items, airlineList]);



	return (

		<div className="airline-bar-wrapper">
			<div className="airline-bar" ref={containerRef}>
				{items.map((airline, idx) => (
					<div className="airline-logo" key={airline._id + '-' + idx}>
						<img
							src={airline.logoPicture}  // using logoPicture from backend data
							alt={airline.shortName}
						/>
					</div>
				))}
			</div>
		</div>

	);
}

