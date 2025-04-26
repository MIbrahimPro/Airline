import React, { useState } from 'react';
import './FilterSidebar.scss';

const times = [
	{ label: 'Morning', range: '6:00–12:00', value: 'morning' },
	{ label: 'Noon', range: '12:00–18:00', value: 'noon' },
	{ label: 'Evening', range: '18:00–23:59', value: 'evening' },
	{ label: 'Night', range: '00:00–6:00', value: 'night' },
];

const stopsOptions = [
	{ label: 'Direct', value: 'direct' },
	{ label: '1 Stop', value: 'one-stop' },
	{ label: '2+ Stops', value: '2+ stops' },
];

const airlines = [
	'aegean-airlines',
	'air-albania',
	'air-canada',
	'air-france',
	'air-india',
	'air-mauritius',
	'air-new-zealand',
	'air-serbia',
	'air-transat',
	'akasa-air',
	'asiana-airlines',
	'avianca',
	'azerbaijan-airlines',
	'british-airways',
	'brussels-airlines',
	'cathay-pacific',
	'copa-airlines',
	'eurowings',
	'garuda-indonesia',
	'kenya-airways',
	'klm',
	'lufthansa',
	'malaysia-airlines',
	'oman-air',
	'philippine-airlines',
	'qatar-airways',
	'riyadh-air',
	'ryanair',
	'singapore-airlines',
	'starlux-airlines',
	'swiss',
	'transavia',
	'turkish-airlines',
	'united-airlines',
	'vietnam-airlines',
	'virgin-atlantic',
	'westjet'
];

export default function FilterSidebar() {

	const priceMinBound = 1;
	const priceMaxBound = 1000;
	const [priceMin, setPriceMin] = useState(100);
	const [priceMax, setPriceMax] = useState(800);

	const [selectedTimes, setSelectedTimes] = useState([]);
	const [selectedAirlines, setSelectedAirlines] = useState([]);

	const [selectedStop, setSelectedStop] = useState(null);

	const toggleTime = (timeValue) => {
		setSelectedTimes((prev) =>
			prev.includes(timeValue)
				? prev.filter((v) => v !== timeValue)
				: [...prev, timeValue]
		);
	};

	const handleStopSelect = (stopValue) => {
		setSelectedStop((prev) => (prev === stopValue ? null : stopValue));
	};

	const toggleAirline = (airline) => {
		setSelectedAirlines((prev) =>
			prev.includes(airline)
				? prev.filter((v) => v !== airline)
				: [...prev, airline]
		);
	};

	const handleMinPriceChange = (e) => {
		const value = Number(e.target.value);
		if (value > priceMax) {
			setPriceMin(priceMax);
		} else {
			setPriceMin(value);
		}
	};

	const handleMaxPriceChange = (e) => {
		const value = Number(e.target.value);
		if (value < priceMin) {
			setPriceMax(priceMin);
		} else {
			setPriceMax(value);
		}
	};

	return (
		<div className="filter-sidebar-inner">



			<div className="fs-header">
				<h3>Filter</h3>
				<button className="reset-btn">Reset</button>
			</div>



			{/* Departure Time */}
			<div className="fs-group">
				<h4>Departure Time</h4>
				<div className="time-buttons">
					{times.map((t) => (
						<button
							key={t.value}
							className={selectedTimes.includes(t.value) ? 'selected' : ''}
							onClick={() => toggleTime(t.value)}
						>
							{t.label}
							<br />
							<small>{t.range}</small>
						</button>
					))}
				</div>
			</div>




			{/* Price Selector */}
			<div className="fs-group">
				<h4>Price <small>(in k PKR)</small></h4>

				<div className="range-container">
					<input
						type="range"
						min={priceMinBound}
						max={priceMaxBound}
						value={priceMin}
						onChange={handleMinPriceChange}
						className="range-input min-range"
					/>
					<input
						type="range"
						min={priceMinBound}
						max={priceMaxBound}
						value={priceMax}
						onChange={handleMaxPriceChange}
						className="range-input max-range"
					/>
					<div className="range-track">
						<div
							className="range-active"
							style={{
								left:
									((priceMin - priceMinBound) /
										(priceMaxBound - priceMinBound)) *
									100 +
									'%',
								right:
									(100 -
										((priceMax - priceMinBound) /
											(priceMaxBound - priceMinBound)) *
										100) +
									'%',
							}}
						></div>
					</div>
				</div>

				<div className="price-inputs">
					<input
						type="number"
						placeholder="Min price (k)"
						value={priceMin}
						onChange={handleMinPriceChange}
						min={priceMinBound}
						max={priceMaxBound}
					/>
					<input
						type="number"
						placeholder="Max price (k)"
						value={priceMax}
						onChange={handleMaxPriceChange}
						min={priceMinBound}
						max={priceMaxBound}
					/>
				</div>
			</div>



			{/* Stops Selector as Tiles (Single Select) */}
			<div className="fs-group">
				<h4>Stops</h4>
				<div className="stops-buttons">
					{stopsOptions.map((opt) => (
						<button
							key={opt.value}
							className={selectedStop === opt.value ? 'selected' : ''}
							onClick={() => handleStopSelect(opt.value)}
						>
							{opt.label}
						</button>
					))}
				</div>
			</div>



			{/* Airlines */}
			<div className="fs-group">
				<h4>Airlines</h4>
				<div className="airlines-grid">
					{airlines.map((a) => (
						<div
							key={a}
							className={`airline-tile ${selectedAirlines.includes(a) ? 'selected' : ''}`}
							onClick={() => toggleAirline(a)}
						>
							<img src={`../airlines/icons/${a}.svg`} alt={a.replace(/-/g, ' ')} />
						</div>
					))}
				</div>
			</div>


			
		</div>
	);
}