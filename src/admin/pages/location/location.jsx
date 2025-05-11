import React, { useState, useEffect, useCallback  } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import "./location.scss";


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



function EditLocationPopup({ loc, onClose, onSaved }) {
    const [form, setForm] = useState({
        locationName: '',
        country: '',
        isPopular: false,
        description: '',
        dealings: 'none',
        dealingsDescription: '',
    })
    const [countries, setCountries] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState(loc?.image || '')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)


    // populate form when `loc` changes
    useEffect(() => {
        if (!loc) return
        setForm({
            locationName: loc.name || loc.locationName || '',
            country: loc.countryId || loc.country || '',
            isPopular: loc.isPopular,
            description: loc.description || '',
            dealings: loc.dealings,
            dealingsDescription: loc.dealingsDescription || '',
        })
        setPreview(loc.image)
        setError(null)
    }, [loc])

    // fetch country list
    useEffect(() => {
        const token = getToken()
        axios
            .get('/api/country', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setCountries(res.data))
            .catch(err => console.error('Failed to load countries', err))
    }, [])

    const onChange = e => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    const onImageChange = e => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        // client-side validation for description when popular
        if (form.isPopular && !form.description.trim()) {
            setError('Description is required for popular destinations.')
            setSaving(false)
            return
        }

        try {
            const token = getToken()
            let imageUrl = loc.image
            if (imageFile) {
                const data = new FormData()
                data.append('image', imageFile)
                const uploadRes = await axios.post('/api/upload', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                })
                imageUrl = uploadRes.data.imageUrl
            }

            const payload = {
                name: form.locationName,
                country: form.country,
                isPopular: form.isPopular,
                description: form.description.trim(),
                dealings: form.dealings,
                dealingsDescription: form.dealings !== 'none' ? form.dealingsDescription : undefined,
                image: imageUrl,
            }

            const res = await axios.put(
                `/api/location/${loc.locationId}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            // normalize response for parent
            const updated = { ...res.data, locationName: res.data.name }
            onSaved(updated)
        } catch (err) {
            setError(err.response?.data?.error || err.message)
        } finally {
            setSaving(false)
        }
    }

    if (!loc) return null

    return (
        <>
            <div className="popup-overlay" onClick={onClose}>
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                    <h3>Edit Location</h3>
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit} className="edit-form">
                        <label>
                            Name
                            <input
                                name="locationName"
                                value={form.locationName}
                                onChange={onChange}
                                required
                            />
                        </label>

                        <div className="country-popular-row">
                            <label className="flex-grow">
                                Country
                                <select
                                    name="country"
                                    value={form.country}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">— select a country —</option>
                                    {countries.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="checkbox-inline">
                                <input
                                    type="checkbox"
                                    name="isPopular"
                                    checked={form.isPopular}
                                    onChange={onChange}
                                />
                                Popular Destination
                            </label>
                        </div>

                        <label>
                            Description
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                required={form.isPopular}
                            />
                        </label>

                        <label>
                            Dealings
                            <select name="dealings" value={form.dealings} onChange={onChange}>
                                <option value="none">None</option>
                                <option value="last-minutes">Last Minutes</option>
                                <option value="top-destinations">Top Destinations</option>
                                <option value="hot-deals">Hot Deals</option>
                            </select>
                        </label>

                        {form.dealings !== 'none' && (
                            <label>
                                Dealings Description *
                                <textarea
                                    name="dealingsDescription"
                                    value={form.dealingsDescription}
                                    onChange={onChange}
                                    required
                                />
                            </label>
                        )}

                        <label>
                            Image
                            <input type="file" accept="image/*" onChange={onImageChange} />
                        </label>

                        <div className="image-preview">
                            <img src={preview} alt="preview" />
                        </div>

                        <div className="popup-actions">
                            <button type="button" className="cancel-btn" onClick={onClose} disabled={saving}>
                                Cancel
                            </button>
                            <button type="submit" className="confirm-btn" disabled={saving}>
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>


        </>
    )
}


function AddLocationPopup({ onClose, onAdded }) {
    const [form, setForm] = useState({
        locationName: '',
        country: '',
        isPopular: false,
        description: '',
        dealings: 'none',
        dealingsDescription: '',
    })
    const [countries, setCountries] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)


    // fetch countries
    useEffect(() => {
        const token = getToken()
        axios.get('/api/country', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setCountries(res.data))
            .catch(err => console.error('Failed to load countries', err))
    }, [])

    const onChange = e => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    const onImageChange = e => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        // required validation
        if (!form.locationName.trim()) {
            setError('Name is required.')
            setSaving(false)
            return
        }
        if (!form.country) {
            setError('Country is required.')
            setSaving(false)
            return
        }
        if (!imageFile) {
            setError('Image is required.')
            setSaving(false)
            return
        }
        if (form.isPopular && !form.description.trim()) {
            setError('Description is required for popular destinations.')
            setSaving(false)
            return
        }
        if (form.dealings !== 'none' && !form.dealingsDescription.trim()) {
            setError('Dealings description is required when dealings is selected.')
            setSaving(false)
            return
        }

        try {
            const token = getToken()
            // upload image
            const data = new FormData()
            data.append('image', imageFile)
            const uploadRes = await axios.post('/api/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })
            const imageUrl = uploadRes.data.imageUrl

            const payload = {
                name: form.locationName.trim(),
                country: form.country,
                isPopular: form.isPopular,
                description: form.description.trim(),
                dealings: form.dealings,
                dealingsDescription: form.dealings !== 'none' ? form.dealingsDescription.trim() : undefined,
                image: imageUrl
            }

            const res = await axios.post(
                '/api/location',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            onAdded({ ...res.data, locationName: res.data.name })
        } catch (err) {
            setError(err.response?.data?.error || err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <div className="popup-overlay" onClick={onClose}>
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                    <h3>Add New Location</h3>
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit} className="edit-form">
                        <label>
                            Name *
                            <input
                                name="locationName"
                                value={form.locationName}
                                onChange={onChange}
                                required
                            />
                        </label>

                        <div className="country-popular-row">
                            <label className="flex-grow">
                                Country *
                                <select
                                    name="country"
                                    value={form.country}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">— select a country —</option>
                                    {countries.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="checkbox-inline">
                                <input
                                    type="checkbox"
                                    name="isPopular"
                                    checked={form.isPopular}
                                    onChange={onChange}
                                /> Popular Destination
                            </label>
                        </div>

                        <label>
                            Description {form.isPopular && '*'}
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                required={form.isPopular}
                            />
                        </label>

                        <label>
                            Dealings
                            <select name="dealings" value={form.dealings} onChange={onChange}>
                                <option value="none">None</option>
                                <option value="last-minutes">Last Minutes</option>
                                <option value="top-destinations">Top Destinations</option>
                                <option value="hot-deals">Hot Deals</option>
                            </select>
                        </label>

                        {form.dealings !== 'none' && (
                            <label>
                                Dealings Description *
                                <textarea
                                    name="dealingsDescription"
                                    value={form.dealingsDescription}
                                    onChange={onChange}
                                    required
                                />
                            </label>
                        )}

                        <label>
                            Image *
                            <input type="file" accept="image/*" onChange={onImageChange} required />
                        </label>

                        {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="preview" />
                            </div>
                        )}

                        <div className="popup-actions">
                            <button type="button" className="cancel-btn" onClick={onClose} disabled={saving}>
                                Cancel
                            </button>
                            <button type="submit" className="confirm-btn" disabled={saving}>
                                {saving ? 'Adding…' : 'Add Location'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>


        </>
    )
}






const LocationPage = () => {

    //=============================================================================================

    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    //=============================================================================================

    const { search } = useLocation();
    const qp = new URLSearchParams(search);
    const [selectedCountryId, setSelectedCountryId] = useState(qp.get("countryId"));
    const [countryName, setCountryName] = useState("")
    const [countries, setCountries] = useState([]);
    const [searchName, setSearchName] = useState('');



    useEffect(() => {

        if (selectedCountryId !== null && selectedCountryId !== '') {
            setLoading(true);
            const fetchcountryname = async () => {
                try {
                    const response = await axios.get(`/api/country/${selectedCountryId}`);
                    setCountryName(response.data.name);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to fetch country data');
                    setLoading(false);
                } finally {
                    setLoading(false)
                }
            };
            fetchcountryname();
        }
        else {
            setCountryName('')
        }
    }, [selectedCountryId]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('/api/country');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);



    const handleNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleCountryChange = (event) => {
        setSelectedCountryId(event.target.value);
    };





    //=============================================================================================



    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [results, setResults] = useState([]);
    const pageSize = 20;


    // const fetchLocations = async () => {
    //     try {
    //         const response = await axios.get('/api/location/search', {
    //             params: {
    //                 q: searchName,
    //                 countryId: selectedCountryId,
    //                 page: currentPage,
    //                 size: pageSize,
    //                 detail: true
    //             },
    //         });

    //         // setCurrentPage(response.data.currentPage);
    //         setTotalPages(response.data.totalPages);
    //         setResults(response.data.results);
    //     } catch (error) {
    //         console.error('Error fetching locations:', error);
    //         setResults([]);
    //         // setCurrentPage(1);
    //         setTotalPages(1);
    //     }
    // };

    // useEffect(() => {

    //     fetchLocations();

    // }, [currentPage, selectedCountryId, searchName])


    const fetchLocations = useCallback(async () => {
        try {
            const response = await axios.get('/api/location/search', {
                params: {
                    q: searchName,
                    countryId: selectedCountryId,
                    page: currentPage,
                    size: pageSize,
                    detail: true
                },
            });

            setTotalPages(response.data.totalPages);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setResults([]);
            setTotalPages(1);
        }
    }, [searchName, selectedCountryId, currentPage, pageSize]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);





    //=============================================================================================



    const [toEdit, setToEdit] = useState(null);
    const [Del, setDel] = useState(null);
    const [add, setAdd] = useState(false);

    //==

    const handleNavAir = (loc) => {
        nav(`/admin/airports?search=${loc.locationName}`);
    }

    //==

    const handleopenEdit = (loc) => {
        setToEdit(loc);
    }

    const handlecloseEdit = (loc) => {
        setToEdit(null);
    }

    const handleEdit = (loc) => {
        setToEdit(null)
        fetchLocations();
    }

    //==

    const handleopenDel = (loc) => {
        setDel(loc);
    }

    const onCancelDel = () => {
        setDel(null);
    }

    const HandleDelete = async () => {
        try {
            const token = getToken();
            await axios.delete(`/api/location/${Del.locationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLocations()
            setDel(null);
        } catch (err) {
            console.log(err)
        }
    };

    //==

    const handleOpenAdd = () => {
        setAdd(true)
    }

    const handlecloseAdd = (loc) => {
        setAdd(false);
    }

    const handleAdd = (loc) => {
        setAdd(false)
        fetchLocations();
    }




    //=============================================================================================
    //=============================================================================================








    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    return (
        <>
            <Navbar />
            <div className="locations-page-admin">

                <h1>Manage Locations {selectedCountryId ? `in ${countryName}` : ""}</h1>

                <button className="add-btn" onClick={handleOpenAdd}><img src="../icons/plus_w.svg" alt="plus" ></img> Add location</button>

                <div className="location-search">

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


                        <label>
                            Countries:
                            <select name="dealings" value={selectedCountryId} onChange={handleCountryChange}>
                                <option value="">None</option>
                                {countries.map(country => (
                                    <option key={country._id} value={country._id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                    </form>

                </div>




                <div className="locations-tiles">
                    <h2>Locations:</h2>


                    <div className="tiles-cont">
                        {results.map(location => (
                            <div key={location.locationId} className="location-tile">

                                <div className="image-cont">
                                    <img
                                        src={location.image}
                                        alt={location.locationName}
                                    />
                                </div>

                                <div className="location-info">
                                    <h3>{location.locationName}, ({location.countryName}, {location.regionName})</h3>
                                    <p className={location.isPopular ? ("popular") : ("not-popular")}><b>Popular: </b>{location.isPopular ? 'Yes' : 'No'}</p>
                                    {location.description && <p><b>Description:</b> {location.description}</p>}
                                    <p className={location.dealings === 'last-minutes' ? 'lmd' : location.dealings === 'top-destinations' ? 'td' : location.dealings === 'hot-deals' ? 'hd' : 'nn'}><b>Dealings: </b>{location.dealings}</p>
                                    {location.dealingsDescription && <p><b>Dealings Description: </b>{location.dealingsDescription}</p>}
                                </div>

                                <div className="actions">
                                    <button onClick={() => handleopenEdit(location)}><img src="../icons/edit.svg" alt="EDIT" /></button>
                                    {!location.hasAirports && <button onClick={() => handleopenDel(location)}><img src="../icons/delete.svg" alt="DELETE" /></button>}
                                    {location.hasAirports && <button onClick={() => handleNavAir(location)}><img src="../icons/takeoff_b.svg" alt="VIEW AIRPORTS" /></button>}
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
                            <div className="popup-actions">
                                <button className="cancel-btn" onClick={onCancelDel}>Cancel</button>
                                <button className="confirm-btn" onClick={HandleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>

                )}


                {toEdit && (
                    <EditLocationPopup loc={toEdit} onClose={handlecloseEdit} onSaved={handleEdit} />
                )}


                {add && (
                    <AddLocationPopup onClose={handlecloseAdd} onAdded={handleAdd} />
                )}


            </div>
        </>

    )

}

export default LocationPage;

