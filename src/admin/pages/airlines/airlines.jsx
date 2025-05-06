// import React, { useState, useEffect } from "react";
// import Navbar from "../../components/navbar/adminnavbar";
// import { getToken } from "../../utils/auth";
// import "./airlines.scss";

// const AirlinesPage = () => {
//   const [airlines, setAirlines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     shortName: "", logoPicture: "", monogramPicture: "",
//     overview: "", baggage: false, details: [{ heading: "", description: "" }],
//     baggageArray: [{ heading: "", description: "" }]
//   });
//   const [editingId, setEditingId] = useState(null);
//   const token = getToken();

//   useEffect(() => {
//     fetch("/api/airline")
//       .then(r => r.json())
//       .then(data => { setAirlines(data); setLoading(false); });
//   }, []);

//   const handleFormChange = e => {
//     const { name, value, type, checked } = e.target;
//     setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
//   };

//   const handleDetailChange = (idx, field, value, arrName = "details") => {
//     setForm(f => {
//       const arr = [...f[arrName]];
//       arr[idx] = { ...arr[idx], [field]: value };
//       return { ...f, [arrName]: arr };
//     });
//   };

//   const addDetailRow = arrName => {
//     setForm(f => ({ ...f, [arrName]: [...f[arrName], { heading: "", description: "" }] }));
//   };

//   // at top of file
//   const uploadImage = async (file, fieldName) => {
//     const formData = new FormData();
//     formData.append("image", file);

//     // optional: you could set some "uploading" state here
//     const res = await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//       headers: {
//         Authorization: `Bearer ${token}`, // if you protect your upload route
//       },
//     });
//     if (!res.ok) throw new Error("Upload failed");
//     const { imageUrl } = await res.json();
//     setForm(f => ({ ...f, [fieldName]: imageUrl }));
//   };


//   const handleAdd = async e => {
//     e.preventDefault();
//     const res = await fetch("/api/airline", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(form)
//     });
//     const a = await res.json();
//     setAirlines([a, ...airlines]);
//     setForm({
//       shortName: "", logoPicture: "", monogramPicture: "",
//       overview: "", baggage: false, details: [{ heading: "", description: "" }],
//       baggageArray: [{ heading: "", description: "" }]
//     });
//   };

//   const startEdit = a => {
//     setEditingId(a._id);
//     setForm({
//       shortName: a.shortName, logoPicture: a.logoPicture, monogramPicture: a.monogramPicture,
//       overview: a.overview, baggage: a.baggage,
//       details: a.details.length ? a.details : [{ heading: "", description: "" }],
//       baggageArray: a.baggageArray.length ? a.baggageArray : [{ heading: "", description: "" }]
//     });
//   };

//   const saveEdit = async id => {
//     const res = await fetch(`/api/airline/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(form)
//     });
//     const updated = await res.json();
//     setAirlines(airlines.map(a => a._id === id ? updated : a));
//     setEditingId(null);
//   };

//   const handleDelete = async id => {
//     if (!window.confirm("Delete this airline?")) return;
//     await fetch(`/api/airline/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setAirlines(airlines.filter(a => a._id !== id));
//   };

//   if (loading) return <div className="airlines-page">Loading…</div>;

//   return (
//     <><Navbar />
//       <div className="airlines-page-admin">
//         <h1>Manage Airlines</h1>
//         <form className="airline-form" onSubmit={handleAdd}>
//           <input name="shortName" placeholder="Short Name" value={form.shortName} onChange={handleFormChange} required />
//           <div className="file-input">
//             <label>Logo Image
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => {
//                   const file = e.target.files[0];
//                   if (file) uploadImage(file, "logoPicture");
//                 }}
//               />
//             </label>
//             {form.logoPicture && (
//               <img src={form.logoPicture} alt="Logo preview" className="preview" />
//             )}
//           </div>
//           <div className="file-input">
//             <label>Monogram Image
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={e => {
//                   const file = e.target.files[0];
//                   if (file) uploadImage(file, "monogramPicture");
//                 }}
//               />
//             </label>
//             {form.monogramPicture && (
//               <img src={form.monogramPicture} alt="Monogram preview" className="preview" />
//             )}
//           </div>
//           <textarea name="overview" placeholder="Overview" value={form.overview} onChange={handleFormChange} required />
//           <label><input type="checkbox" name="baggage" checked={form.baggage} onChange={handleFormChange} /> Baggage?</label>
//           <div className="details-block">
//             <h4>Details</h4>
//             {form.details.map((d, i) => (
//               <div key={i} className="subitem">
//                 <input placeholder="Heading" value={d.heading}
//                   onChange={e => handleDetailChange(i, "heading", e.target.value, "details")} required />
//                 <input placeholder="Description" value={d.description}
//                   onChange={e => handleDetailChange(i, "description", e.target.value, "details")} required />
//               </div>
//             ))}
//             <button type="button" onClick={() => addDetailRow("details")}>+ Detail</button>
//           </div>
//           {form.baggage && (
//             <div className="details-block">
//               <h4>Baggage Array</h4>
//               {form.baggageArray.map((d, i) => (
//                 <div key={i} className="subitem">
//                   <input placeholder="Heading" value={d.heading}
//                     onChange={e => handleDetailChange(i, "heading", e.target.value, "baggageArray")} required />
//                   <input placeholder="Description" value={d.description}
//                     onChange={e => handleDetailChange(i, "description", e.target.value, "baggageArray")} required />
//                 </div>
//               ))}
//               <button type="button" onClick={() => addDetailRow("baggageArray")}>+ Baggage Item</button>
//             </div>
//           )}
//           <button type="submit">Add Airline</button>
//         </form>

//         <table className="airlines-table">
//           <thead>
//             <tr>
//               <th>Short</th><th>Logo</th><th>Mono</th><th>Baggage</th><th>Created</th><th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {airlines.map(a => (
//               <tr key={a._id}>
//                 <td>{a.shortName}</td>
//                 <td><img src={a.logoPicture} alt="" /></td>
//                 <td><img src={a.monogramPicture} alt="" /></td>
//                 <td>{a.baggage ? "Yes" : ""}</td>
//                 <td>{new Date(a.createdAt).toLocaleDateString()}</td>
//                 <td>
//                   <button onClick={() => startEdit(a)}>Edit</button>
//                   <button onClick={() => handleDelete(a._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {editingId && (
//           <div className="popup-backdrop">
//             <div className="popup">
//               <h3>Edit Airline</h3>
//               {/* reuse same inputs */}
//               <label>Short Name<input name="shortName" value={form.shortName} onChange={handleFormChange} /></label>
//               <label>Logo URL<input name="logoPicture" value={form.logoPicture} onChange={handleFormChange} /></label>
//               <label>Mono URL<input name="monogramPicture" value={form.monogramPicture} onChange={handleFormChange} /></label>
//               <label>Overview<textarea name="overview" value={form.overview} onChange={handleFormChange} /></label>
//               <label><input type="checkbox" name="baggage" checked={form.baggage} onChange={handleFormChange} /> Baggage?</label>
//               {/* details & baggageArray blocks same as above */}
//               <div className="buttons">
//                 <button onClick={() => saveEdit(editingId)}>Save</button>
//                 <button onClick={() => setEditingId(null)}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AirlinesPage;













import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/adminnavbar';
import { getToken } from '../../utils/auth';
import './airlines.scss';

const AirlinesPage = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    shortName: '',
    logoPicture: '',
    monogramPicture: '',
    overview: '',
    baggage: false,
    details: [{ heading: '', description: '' }],
    baggageArray: [{ heading: '', description: '' }]
  });
  const [editingId, setEditingId] = useState(null);
  const token = getToken();

  useEffect(() => {
    fetch('/api/airline')
      .then(r => r.json())
      .then(data => { setAirlines(data); setLoading(false); });
  }, []);

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDetailChange = (idx, field, value, arrName = 'details') => {
    setForm(f => {
      const arr = [...f[arrName]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...f, [arrName]: arr };
    });
  };

  const addDetailRow = arrName => {
    setForm(f => ({ ...f, [arrName]: [...f[arrName], { heading: '', description: '' }] }));
  };

  // Upload single image and set URL
  const uploadImage = async (file, fieldName) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });
    if (!res.ok) throw new Error('Upload failed');
    const { imageUrl } = await res.json();
    setForm(f => ({ ...f, [fieldName]: imageUrl }));
  };

  const handleSubmit = async (method, url) => {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    return res.json();
  };

  const handleAdd = async e => {
    e.preventDefault();
    const a = await handleSubmit('POST', '/api/airline');
    setAirlines([a, ...airlines]);
    setForm({ shortName: '', logoPicture: '', monogramPicture: '', overview: '', baggage: false, details: [{ heading: '', description: '' }], baggageArray: [{ heading: '', description: '' }] });
  };

  const startEdit = a => {
    setEditingId(a._id);
    setForm({ ...a });
  };

  const saveEdit = async () => {
    const updated = await handleSubmit('PUT', `/api/airline/${editingId}`);
    setAirlines(airlines.map(a => a._id === editingId ? updated : a));
    setEditingId(null);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this airline?')) return;
    await fetch(`/api/airline/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setAirlines(airlines.filter(a => a._id !== id));
  };

  if (loading) return <div className="airlines-page">Loading…</div>;

  return (
    <>
      <Navbar />
      <div className="airlines-page-admin">
        <h1>Manage Airlines</h1>

        <form className="airline-form" onSubmit={handleAdd}>
          {/* Short Name */}
          <input name="shortName" placeholder="Short Name" value={form.shortName} onChange={handleFormChange} required />

          {/* Logo Upload */}
          <div className="file-input">
            <label>Logo Image<input type="file" accept="image/*" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'logoPicture')} /></label>
            {form.logoPicture && <img src={form.logoPicture} alt="Logo preview" className="preview" />}
          </div>

          {/* Monogram Upload */}
          <div className="file-input">
            <label>Monogram Image<input type="file" accept="image/*" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'monogramPicture')} /></label>
            {form.monogramPicture && <img src={form.monogramPicture} alt="Monogram preview" className="preview" />}
          </div>

          {/* Overview */}
          <textarea name="overview" placeholder="Overview" value={form.overview} onChange={handleFormChange} required />

          {/* Baggage Toggle */}
          <label><input type="checkbox" name="baggage" checked={form.baggage} onChange={handleFormChange} /> Baggage?</label>

          {/* Details */}
          <div className="details-block">
            <h4>Details</h4>
            {form.details.map((d, i) => (
              <div key={i} className="subitem">
                <input placeholder="Heading" value={d.heading} onChange={e => handleDetailChange(i, 'heading', e.target.value)} required />
                <input placeholder="Description" value={d.description} onChange={e => handleDetailChange(i, 'description', e.target.value)} required />
              </div>
            ))}
            <button type="button" onClick={() => addDetailRow('details')}>+ Detail</button>
          </div>

          {/* Baggage Array */}
          {form.baggage && (
            <div className="details-block">
              <h4>Baggage Array</h4> 
                       {form.baggageArray.map((d, i) => (
                <div key={i} className="subitem">
                  <input placeholder="Heading" value={d.heading} onChange={e => handleDetailChange(i, 'heading', e.target.value, 'baggageArray')} required />
                  <input placeholder="Description" value={d.description} onChange={e => handleDetailChange(i, 'description', e.target.value, 'baggageArray')} required />
                </div>
              ))}
              <button type="button" onClick={() => addDetailRow('baggageArray')}>+ Baggage Item</button>
            </div>
          )}

          <button type="submit">{editingId ? 'Save' : 'Add Airline'}</button>
        </form>

        {/* Airlines Table */}
        <table className="airlines-table">
          <thead>
            <tr><th>Short</th><th>Logo</th><th>Mono</th><th>Baggage</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {airlines.map(a => (
              <tr key={a._id}>
                <td>{a.shortName}</td>
                <td><img src={a.logoPicture} alt="" /></td>
                <td><img src={a.monogramPicture} alt="" /></td>
                <td>{a.baggage ? 'Yes' : ''}</td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => startEdit(a)}>Edit</button><button onClick={() => handleDelete(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AirlinesPage;