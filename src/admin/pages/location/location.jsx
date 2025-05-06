import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import "./location.scss";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    countryId: "",
    image: "",
    imageFile: null, // holds the selected file
    isPopular: false,
    description: "",
    dealings: "none",
    dealingsDescription: ""
  });
  const [imagePreview, setImagePreview] = useState(""); // for previewing new image
  const [detail, setDetail] = useState(null);
  const [editing, setEditing] = useState(false);
  const nav = useNavigate();
  const { search } = useLocation();
  const qp = new URLSearchParams(search);
  const countryId = qp.get("countryId");
  const token = getToken();

  // load countries & locations
  useEffect(() => {
    const load = async () => {
      if (!countryId) {
        const r = await fetch("/api/country");
        setCountries(await r.json());
      }
      const url = countryId ? `/api/location/country/${countryId}` : "/api/location";
      const res = await fetch(url);
      const locs = await res.json();
      // the API returns the pre-calculated `hasAirport` field
      setLocations(locs);
      setLoading(false);
    };
    load();
  }, [countryId]);

  const refresh = updated =>
    setLocations(locations.map(l => l._id === updated._id ? updated : l));

  // handle text/checkbox/select updates
  const handleInput = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // handle file input change for image uploads
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // helper to upload image file if present;
  // expects the upload API to return the new image URL/path
  const uploadImage = async () => {
    if (form.imageFile) {
      const formData = new FormData();
      formData.append("image", form.imageFile);
      // You might need to update this endpoint depending on your server
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      return data.imageUrl; // assume server returns an { imageUrl } object
    }
    return form.image; // if no file, use the current image URL
  };

  const handleAdd = async e => {
    e.preventDefault();
    if (!form.name.trim() || (!countryId && !form.countryId)) return;
    
    // if a file is selected, upload it and get the new image URL.
    const uploadedImage = await uploadImage();
    
    const body = {
      name: form.name,
      country: countryId || form.countryId,
      image: uploadedImage,
      isPopular: form.isPopular,
      description: form.isPopular ? form.description : "",
      dealings: form.dealings,
      dealingsDescription: form.dealings !== "none" ? form.dealingsDescription : ""
    };
    const res = await fetch("/api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const loc = await res.json();
    // populate country object for UI
    const cn = countryId
      ? { _id: countryId, name: locations.find(l => l._id === loc._id)?.country.name }
      : countries.find(c => c._id === loc.country);
    setLocations([{ ...loc, country: cn }, ...locations]);
    // reset form and image preview
    setForm({
      name: "",
      countryId: "",
      image: "",
      imageFile: null,
      isPopular: false,
      description: "",
      dealings: "none",
      dealingsDescription: ""
    });
    setImagePreview("");
  };

  const openDetail = loc => {
    setDetail(loc);
    setEditing(true);
    setForm({
      name: loc.name,
      countryId: loc.country._id,
      image: loc.image || "",
      imageFile: null, // reset any previous file
      isPopular: loc.isPopular || false,
      description: loc.description || "",
      dealings: loc.dealings || "none",
      dealingsDescription: loc.dealingsDescription || ""
    });
    // set preview to current image if available
    setImagePreview(loc.image || "");
  };

  const closeDetail = () => {
    setDetail(null);
    setEditing(false);
    setImagePreview("");
  };

  const handleSave = async () => {
    const id = detail._id;
    // upload new image if one was chosen
    const uploadedImage = await uploadImage();
    const body = {
      name: form.name,
      country: form.countryId,
      image: uploadedImage,
      isPopular: form.isPopular,
      description: form.isPopular ? form.description : "",
      dealings: form.dealings,
      dealingsDescription: form.dealings !== "none" ? form.dealingsDescription : ""
    };
    const res = await fetch(`/api/location/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const updated = await res.json();
    // restore country object if available
    updated.country = countries.find(c => c._id === body.country) || detail.country;
    refresh(updated);
    closeDetail();
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this location?")) return;
    await fetch(`/api/location/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setLocations(locations.filter(l => l._id !== id));
  };

  if (loading) return <div className="locations-page">Loading…</div>;

  return (
    <>
      <Navbar />
      <div className="locations-page">
        <h1>Manage Locations {countryId ? "in country" : ""}</h1>

        <form className="add-form" onSubmit={handleAdd}>
          <input
            name="name"
            placeholder="Location name"
            value={form.name}
            onChange={handleInput}
          />
          {!countryId && (
            <select name="countryId" value={form.countryId} onChange={handleInput}>
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          )}

          {/* File input for image */}
          <label className="file-upload">
            {imagePreview 
              ? (<img src={imagePreview} alt="preview" />)
              : "Upload image"}
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          <label>
            <input
              name="isPopular"
              type="checkbox"
              checked={form.isPopular}
              onChange={handleInput}
            /> Popular
          </label>
          {form.isPopular && (
            <input
              name="description"
              placeholder="Popular description"
              value={form.description}
              onChange={handleInput}
            />
          )}
          <select name="dealings" value={form.dealings} onChange={handleInput}>
            <option value="none">No deals</option>
            <option value="last-minutes">Last minutes</option>
            <option value="top-destinations">Top destinations</option>
            <option value="hot-deals">Hot deals</option>
          </select>
          {form.dealings !== "none" && (
            <input
              name="dealingsDescription"
              placeholder="Deal description"
              value={form.dealingsDescription}
              onChange={handleInput}
            />
          )}
          <button type="submit">Add Location</button>
        </form>

        <table className="locations-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Country</th>
              <th>Popular</th>
              <th>Dealings</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(l => (
              <tr key={l._id}>
                <td>{l.name}</td>
                <td>{l.country.name}</td>
                <td>{l.isPopular ? "Yes" : ""}</td>
                <td>{l.dealings !== "none" ? l.dealings : "—"}</td>
                <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                <td>{new Date(l.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => openDetail(l)}>Details/Edit</button>
                  {l.hasAirport ? (
                    <button
                      onClick={() =>
                        nav(
                          `/admin/airports?locationId=${l._id}&locationName=${encodeURIComponent(l.name)}`
                        )
                      }
                    >
                      View Airports
                    </button>
                  ) : (
                    <button onClick={() => handleDelete(l._id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {detail && editing && (
          <div className="popup-backdrop">
            <div className="popup">
              <h3>Edit Location</h3>
              <label>
                Name
                <input name="name" value={form.name} onChange={handleInput} />
              </label>
              {!countryId && (
                <label>
                  Country
                  <select name="countryId" value={form.countryId} onChange={handleInput}>
                    {countries.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="file-upload">
                {imagePreview 
                  ? (<img className="imageer" src={imagePreview} alt="preview" />)
                  : "Upload image"}
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <label>
                <input
                  name="isPopular"
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={handleInput}
                /> Popular
              </label>
              {form.isPopular && (
                <label>
                  Description
                  <input name="description" value={form.description} onChange={handleInput} />
                </label>
              )}
              <label>
                Dealings
                <select name="dealings" value={form.dealings} onChange={handleInput}>
                  <option value="none">None</option>
                  <option value="last-minutes">Last minutes</option>
                  <option value="top-destinations">Top destinations</option>
                  <option value="hot-deals">Hot deals</option>
                </select>
              </label>
              {form.dealings !== "none" && (
                <label>
                  Deal desc
                  <input name="dealingsDescription" value={form.dealingsDescription} onChange={handleInput} />
                </label>
              )}
              <div className="buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={closeDetail}>Cancel</button>
                {!detail.hasAirport && (
                  <button className="delete" onClick={() => handleDelete(detail._id)}>Delete</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LocationsPage;
