import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./airlines.scss";


const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <p className='active'>
                {currentPage} of {totalPages}
            </p>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

function EditAirlinePopup({ airline, onClose, onSaved }) {
    const [form, setForm] = useState({
        shortName: airline.shortName,
        details: airline.details,
        overview: airline.overview,
        baggage: airline.baggage,
        baggageArray: airline.baggageArray || [],
    });
    const [logoFile, setLogoFile] = useState(null);
    const [monogramFile, setMonogramFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(airline.logoPicture);
    const [monogramPreview, setMonogramPreview] = useState(airline.monogramPicture);
    const [logoimageSize, setLogoImageSize] = useState('');
    const [monogramimageSize, setMonogramImageSize] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLogoPreview(airline.logoPicture);
        setMonogramPreview(airline.monogramPicture);
    }, [airline]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDetailChange = (index, field, value) => {
        setForm(prev => {
            const newDetails = [...prev.details];
            newDetails[index][field] = value;
            return { ...prev, details: newDetails };
        });
    };

    const addDetail = () => {
        setForm(prev => ({
            ...prev,
            details: [...prev.details, { heading: '', description: '' }],
        }));
    };

    const removeDetail = index => {
        setForm(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== index),
        }));
    };

    const handleBaggageChange = (index, field, value) => {
        setForm(prev => {
            const newBaggageArray = [...prev.baggageArray];
            newBaggageArray[index][field] = value;
            return { ...prev, baggageArray: newBaggageArray };
        });
    };

    const addBaggage = () => {
        setForm(prev => ({
            ...prev,
            baggageArray: [...prev.baggageArray, { heading: '', description: '' }],
        }));
    };

    const removeBaggage = index => {
        setForm(prev => ({
            ...prev,
            baggageArray: prev.baggageArray.filter((_, i) => i !== index),
        }));
    };

    const onLogoChange = e => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
            const fileSizeInBytes = file.size;
            const fileSizeInKilobytes = (fileSizeInBytes / 1024).toFixed(2);
            const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

            if (fileSizeInMegabytes >= 1) {
                setLogoImageSize(`${fileSizeInMegabytes} MB`);
            } else {
                setLogoImageSize(`${fileSizeInKilobytes} KB`);
            }
        }

    };

    const onMonogramChange = e => {
        const file = e.target.files[0];
        if (file) {
            setMonogramFile(file);
            setMonogramPreview(URL.createObjectURL(file));
            const fileSizeInBytes = file.size;
            const fileSizeInKilobytes = (fileSizeInBytes / 1024).toFixed(2);
            const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

            if (fileSizeInMegabytes >= 1) {
                setMonogramImageSize(`${fileSizeInMegabytes} MB`);
            } else {
                setMonogramImageSize(`${fileSizeInKilobytes} KB`);
            }
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError(null);

        // Validation
        if (!form.shortName.trim()) {
            setError('Short name is required.');
            setSaving(false);
            return;
        }
        if (form.details.length === 0) {
            setError('At least one detail is required.');
            setSaving(false);
            return;
        }
        for (const detail of form.details) {
            if (!detail.heading.trim() || !detail.description.trim()) {
                setError('All details must have a heading and description.');
                setSaving(false);
                return;
            }
        }
        if (!form.overview.trim()) {
            setError('Overview is required.');
            setSaving(false);
            return;
        }
        if (form.baggage && form.baggageArray.length === 0) {
            setError('At least one baggage detail is required when baggage is enabled.');
            setSaving(false);
            return;
        }
        if (form.baggage) {
            for (const item of form.baggageArray) {
                if (!item.heading.trim() || !item.description.trim()) {
                    setError('All baggage details must have a heading and description.');
                    setSaving(false);
                    return;
                }
            }
        }

        try {
            const token = getToken();
            let logoUrl = airline.logoPicture;
            let monogramUrl = airline.monogramPicture;

            // Upload new logo if selected
            if (logoFile) {
                const logoData = new FormData();
                logoData.append('image', logoFile);
                const logoRes = await axios.post('/api/upload/airlines', logoData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                logoUrl = logoRes.data.imageUrl;
            }

            // Upload new monogram if selected
            if (monogramFile) {
                const monogramData = new FormData();
                monogramData.append('image', monogramFile);
                const monogramRes = await axios.post('/api/upload/airlines', monogramData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                monogramUrl = monogramRes.data.imageUrl;
            }

            const payload = {
                shortName: form.shortName.trim(),
                logoPicture: logoUrl,
                monogramPicture: monogramUrl,
                details: form.details.map(d => ({
                    heading: d.heading.trim(),
                    description: d.description.trim(),
                })),
                overview: form.overview.trim(),
                baggage: form.baggage,
                baggageArray: form.baggage
                    ? form.baggageArray.map(d => ({
                        heading: d.heading.trim(),
                        description: d.description.trim(),
                    }))
                    : undefined,
            };

            const res = await axios.put(`/api/airline/${airline._id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onSaved(res.data);
            onClose();
        } catch (err) {
            if((err.response?.data?.error || err.message) === "Request failed with status code 413"){
                setError('Image file is too large.')
            }
            setError(err.response?.data?.error || err.message)
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <h3>Edit Airline</h3>
                {error && <div className="error">{error}</div>}
                <div className="edit-form">
                    <label>
                        Short Name *
                        <input
                            name="shortName"
                            value={form.shortName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Logo Picture * (max 5mb)
                        <input type="file" accept="image/*" onChange={onLogoChange} />
                    </label>
                    {logoPreview && (
                        <div className="image-preview">
                            <img src={logoPreview} alt="Logo Preview" />
                            <p>Size: {logoimageSize}</p>
                        </div>
                    )}
                    <label>
                        Monogram Picture * (max 5mb)
                        <input type="file" accept="image/*" onChange={onMonogramChange} />
                    </label>
                    {monogramPreview && (
                        <div className="image-preview">
                            <img src={monogramPreview} alt="Monogram Preview" />
                            <p>Size: {monogramimageSize}</p>
                        </div>
                    )}
                    <div className="details-section">
                        <h4>Details *</h4>
                        {form.details.map((detail, index) => (
                            <div key={index} className="detail-item">
                                <label>
                                    Heading *
                                    <input
                                        value={detail.heading}
                                        onChange={e => handleDetailChange(index, 'heading', e.target.value)}
                                        required
                                    />
                                </label>
                                <label>
                                    Description *
                                    <textarea
                                        value={detail.description}
                                        onChange={e => handleDetailChange(index, 'description', e.target.value)}
                                        required
                                    />
                                </label>
                                {form.details.length > 1 && (
                                    <button type="button" onClick={() => removeDetail(index)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="add-button" onClick={addDetail}>
                            Add Detail
                        </button>
                    </div>
                    <label>
                        Overview *
                        <textarea
                            name="overview"
                            value={form.overview}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="checkbox-inline">
                        <input
                            type="checkbox"
                            name="baggage"
                            checked={form.baggage}
                            onChange={handleChange}
                        />
                        Baggage
                    </label>
                    {form.baggage && (
                        <div className="baggage-section">
                            <h4>Baggage Details *</h4>
                            {form.baggageArray.map((item, index) => (
                                <div key={index} className="detail-item">
                                    <label>
                                        Heading *
                                        <input
                                            value={item.heading}
                                            onChange={e => handleBaggageChange(index, 'heading', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Description *
                                        <textarea
                                            value={item.description}
                                            onChange={e => handleBaggageChange(index, 'description', e.target.value)}
                                            required
                                        />
                                    </label>
                                    {form.baggageArray.length > 1 && (
                                        <button type="button" onClick={() => removeBaggage(index)}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="add-button" onClick={addBaggage}>
                                Add Baggage Detail
                            </button>
                        </div>
                    )}
                    <div className="popup-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="confirm-btn"
                            onClick={handleSubmit}
                            disabled={saving}
                        >
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddAirlinePopup({ onClose, onAdded }) {
    const [form, setForm] = useState({
        shortName: '',
        details: [{ heading: '', description: '' }],
        overview: '',
        baggage: false,
        baggageArray: [],
    });
    const [logoFile, setLogoFile] = useState(null);
    const [monogramFile, setMonogramFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [monogramPreview, setMonogramPreview] = useState('');
    const [logoimageSize, setLogoImageSize] = useState('');
    const [monogramimageSize, setMonogramImageSize] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDetailChange = (index, field, value) => {
        setForm(prev => {
            const newDetails = [...prev.details];
            newDetails[index][field] = value;
            return { ...prev, details: newDetails };
        });
    };

    const addDetail = () => {
        setForm(prev => ({
            ...prev,
            details: [...prev.details, { heading: '', description: '' }],
        }));
    };

    const removeDetail = index => {
        setForm(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== index),
        }));
    };

    const handleBaggageChange = (index, field, value) => {
        setForm(prev => {
            const newBaggageArray = [...prev.baggageArray];
            newBaggageArray[index][field] = value;
            return { ...prev, baggageArray: newBaggageArray };
        });
    };

    const addBaggage = () => {
        setForm(prev => ({
            ...prev,
            baggageArray: [...prev.baggageArray, { heading: '', description: '' }],
        }));
    };

    const removeBaggage = index => {
        setForm(prev => ({
            ...prev,
            baggageArray: prev.baggageArray.filter((_, i) => i !== index),
        }));
    };

    const onLogoChange = e => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
            const fileSizeInBytes = file.size;
            const fileSizeInKilobytes = (fileSizeInBytes / 1024).toFixed(2);
            const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

            if (fileSizeInMegabytes >= 1) {
                setLogoImageSize(`${fileSizeInMegabytes} MB`);
            } else {
                setLogoImageSize(`${fileSizeInKilobytes} KB`);
            }
        }
    };

    const onMonogramChange = e => {
        const file = e.target.files[0];
        if (file) {
            setMonogramFile(file);
            setMonogramPreview(URL.createObjectURL(file));
            const fileSizeInBytes = file.size;
            const fileSizeInKilobytes = (fileSizeInBytes / 1024).toFixed(2);
            const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

            if (fileSizeInMegabytes >= 1) {
                setMonogramImageSize(`${fileSizeInMegabytes} MB`);
            } else {
                setMonogramImageSize(`${fileSizeInKilobytes} KB`);
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        // Validation
        if (!form.shortName.trim()) {
            setError('Short name is required.');
            setSaving(false);
            return;
        }
        if (!logoFile) {
            setError('Logo picture is required.');
            setSaving(false);
            return;
        }
        if (!monogramFile) {
            setError('Monogram picture is required.');
            setSaving(false);
            return;
        }
        if (form.details.length === 0) {
            setError('At least one detail is required.');
            setSaving(false);
            return;
        }
        for (const detail of form.details) {
            if (!detail.heading.trim() || !detail.description.trim()) {
                setError('All details must have a heading and description.');
                setSaving(false);
                return;
            }
        }
        if (!form.overview.trim()) {
            setError('Overview is required.');
            setSaving(false);
            return;
        }
        if (form.baggage && form.baggageArray.length === 0) {
            setError('At least one baggage detail is required when baggage is enabled.');
            setSaving(false);
            return;
        }
        if (form.baggage) {
            for (const item of form.baggageArray) {
                if (!item.heading.trim() || !item.description.trim()) {
                    setError('All baggage details must have a heading and description.');
                    setSaving(false);
                    return;
                }
            }
        }

        try {
            const token = getToken();

            // Upload logo and monogram to /api/upload/airlines
            const logoData = new FormData();
            logoData.append('image', logoFile);

            const monogramData = new FormData();
            monogramData.append('image', monogramFile);

            const [logoRes, monogramRes] = await Promise.all([
                axios.post('/api/upload/airlines', logoData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }),
                axios.post('/api/upload/airlines', monogramData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            const payload = {
                shortName: form.shortName.trim(),
                logoPicture: logoRes.data.imageUrl,
                monogramPicture: monogramRes.data.imageUrl,
                details: form.details.map(d => ({
                    heading: d.heading.trim(),
                    description: d.description.trim(),
                })),
                overview: form.overview.trim(),
                baggage: form.baggage,
                baggageArray: form.baggage
                    ? form.baggageArray.map(d => ({
                        heading: d.heading.trim(),
                        description: d.description.trim(),
                    }))
                    : undefined,
            };

            const res = await axios.post('/api/airline', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onAdded(res.data);
            onClose();
        } catch (err) {
            if((err.response?.data?.error || err.message) === "Request failed with status code 413"){
                setError('Image file is too large.')
            }
            setError(err.response?.data?.error || err.message)
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <h3>Add New Airline</h3>
                {error && <div className="error">{error}</div>}
                <form className="edit-form" onSubmit={handleSubmit}>
                    <label>
                        Short Name *
                        <input
                            name="shortName"
                            value={form.shortName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Logo Picture * (max 10mb)
                        <input type="file" accept="image/*" onChange={onLogoChange} required />
                    </label>
                    {logoPreview && (
                        <div className="image-preview">
                            <img src={logoPreview} alt="Logo Preview" />
                            <p>Size: {logoimageSize}</p>
                        </div>
                    )}
                    <label>
                        Monogram Picture * (max 10mb)
                        <input type="file" accept="image/*" onChange={onMonogramChange} required />
                    </label>
                    {monogramPreview && (
                        <div className="image-preview">
                            <img src={monogramPreview} alt="Monogram Preview" />
                            <p>Size: {monogramimageSize}</p>
                        </div>
                    )}
                    <div className="details-section">
                        <h4>Details *</h4>
                        {form.details.map((detail, index) => (
                            <div key={index} className="detail-item">
                                <label>
                                    Heading *
                                    <input
                                        value={detail.heading}
                                        onChange={e => handleDetailChange(index, 'heading', e.target.value)}
                                        required
                                    />
                                </label>
                                <label>
                                    Description *
                                    <textarea
                                        value={detail.description}
                                        onChange={e => handleDetailChange(index, 'description', e.target.value)}
                                        required
                                    />
                                </label>
                                {form.details.length > 1 && (
                                    <button type="button" onClick={() => removeDetail(index)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="add-button" onClick={addDetail}>
                            Add Detail
                        </button>
                    </div>
                    <label>
                        Overview *
                        <textarea
                            name="overview"
                            value={form.overview}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="checkbox-inline">
                        <input
                            type="checkbox"
                            name="baggage"
                            checked={form.baggage}
                            onChange={handleChange}
                        />
                        Baggage
                    </label>
                    {form.baggage && (
                        <div className="baggage-section">
                            <h4>Baggage Details *</h4>
                            {form.baggageArray.map((item, index) => (
                                <div key={index} className="detail-item">
                                    <label>
                                        Heading *
                                        <input
                                            value={item.heading}
                                            onChange={e => handleBaggageChange(index, 'heading', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Description *
                                        <textarea
                                            value={item.description}
                                            onChange={e => handleBaggageChange(index, 'description', e.target.value)}
                                            required
                                        />
                                    </label>
                                    {form.baggageArray.length > 1 && (
                                        <button type="button" onClick={() => removeBaggage(index)}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="add-button" onClick={addBaggage}>
                                Add Baggage Detail
                            </button>
                        </div>
                    )}
                    <div className="popup-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="confirm-btn"
                            disabled={saving}
                        >
                            {saving ? 'Adding…' : 'Add Airline'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}




const AirportPage = () => {

    //=============================================================================================

    const nav = useNavigate();
    const [error, setError] = useState(null);


    //=============================================================================================

    const [searchName, setSearchName] = useState('');


    const handleNameChange = (event) => {
        setSearchName(event.target.value);
    };




    //=============================================================================================



    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [results, setResults] = useState([]);
    const pageSize = 20;



    const fetchLocations = useCallback(async () => {
        try {
            const response = await axios.get('/api/airline/search', {
                params: {
                    q: searchName,
                    page: currentPage,
                    size: pageSize,
                },
            });

            setTotalPages(response.data.totalPages);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setError(error.message);
            setResults([]);
            setCurrentPage(1);
            setTotalPages(1);
        }
    }, [searchName, currentPage, pageSize]);


    useEffect(() => {

        fetchLocations();

    }, [fetchLocations])




    //=============================================================================================



    const [toEdit, setToEdit] = useState(null);
    const [Del, setDel] = useState(null);
    const [add, setAdd] = useState(false);

    //==

    const handleNavAir = (a) => {
        nav(`/admin/flight?airlines_id=${a._id}`);
    }

    //==

    const handleopenEdit = (a) => {
        setToEdit(a);
    }

    const handlecloseEdit = (a) => {
        setToEdit(null);
    }

    const handleEdit = (a) => {
        setToEdit(null)
        fetchLocations();
    }

    //==

    const handleopenDel = (a) => {
        setDel(a);
    }

    const onCancelDel = () => {
        setDel(null);
    }

    const HandleDelete = async () => {
        try {
            const token = getToken();
            await axios.delete(`/api/airline/${Del._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLocations()
            setDel(null);
        } catch (err) {
            console.log(err);
        }
    };

    //==

    const handleOpenAdd = () => {
        setAdd(true)
    }

    const handlecloseAdd = () => {
        setAdd(false);
    }

    const handleAdd = () => {
        setAdd(false)
        fetchLocations();
    }




    //=============================================================================================
    //=============================================================================================








    return (
        <>
            <Navbar />
            <div className="airline-page-admin">

                <h1>Manage Airlines</h1>

                <button className="add-btn" onClick={handleOpenAdd}><img src="../icons/plus_w.svg" alt="plus" ></img> Add Airlines</button>

                {error && (
                    <div>{error}</div>
                )}

                <div className="airline-search">

                    <h2>Search</h2>

                    <form >

                        <label>
                            Name:
                            <input
                                type="text"
                                value={searchName}
                                onChange={handleNameChange}
                                placeholder="Enter name to search"
                            />
                        </label>

                    </form>

                </div>




                <div className="airline-tiles">
                    <h2>Airlines:</h2>


                    <div className="tiles-cont">
                        {results.map(a => (
                            <div key={a._id} className="airline-tile">


                                <div className="leftside">

                                    <div className="image-cont">
                                        <img src={a.monogramPicture} alt={a.shortName} />
                                        <img className="biggerplacement" src={a.logoPicture} alt={a.shortName} />
                                    </div>

                                    <div className="airline-info">
                                        <h3>{a.shortName}</h3>
                                        <p><b>Overview: </b>{a.overview}</p>

                                        <h4>Details:</h4>
                                        <ul>
                                            {a.details.map(d => (
                                                <li>&emsp;<b>{d.heading}: </b> {d.description} </li>
                                            ))}
                                        </ul>


                                        {a.baggage && (
                                            <>
                                                <h4>Bookings:</h4>
                                                <ul>
                                                    {a.baggageArray.map(d => (
                                                        <li>&emsp;<b>{d.heading}: </b> {d.description} </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                    </div>





                                </div>

                                <div className="right-side">
                                    <button onClick={() => handleopenEdit(a)}><img src="../icons/edit.svg" alt="EDIT" /></button>
                                    {!a.hasFlights && <button onClick={() => handleopenDel(a)}><img src="../icons/delete.svg" alt="DELETE" /></button>}
                                    {a.hasFlights && <button onClick={() => handleNavAir(a)}><img src="../icons/takeoff_b.svg" alt="VIEW AIRPORTS" /></button>}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>



                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                {Del && (


                    <div className="popup-overlay" onClick={onCancelDel}>
                        <div className="popup-content" onClick={e => e.stopPropagation()}>
                            <h3>Confirm Deletion</h3>
                            <p>Are you sure you want to delete the Location for {Del.locationName}?</p>
                            <div className="edit-form">
                                <div className="popup-actions">
                                    <button className="cancel-btn" onClick={onCancelDel}>Cancel</button>
                                    <button className="confirm-btn" onClick={HandleDelete}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}


                {toEdit && (
                    <EditAirlinePopup airline={toEdit} onClose={handlecloseEdit} onSaved={handleEdit} />
                )}



                {add && (
                    <AddAirlinePopup onClose={handlecloseAdd} onAdded={handleAdd} />
                )}


            </div>
        </>

    )

}

export default AirportPage;

