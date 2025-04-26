import React from 'react';
import FilterSidebar from './FilterSidebar';
import './FilterSidebarModal.scss';

export default function FilterSidebarModal({ onClose }) {
    return (
        <div className="fs-modal-overlay" onClick={onClose}>
            <div className="fs-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="fs-modal-close" onClick={onClose}>
                    ×
                </div>
                <FilterSidebar />
            </div>
        </div>
    );
}
