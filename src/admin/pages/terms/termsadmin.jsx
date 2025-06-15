// src/pages/TermsAdmin.jsx
import React from "react";
import SiteInfoAdmin from "../../components/SiteInfoAdmin/SiteInfoAdmin";
import "./termsadmin.scss";

export default function TermsAdmin() {
    return (
        <div className="terms-page">
            <SiteInfoAdmin
                apiGetPath="/api/siteinfo/admin/all"
                apiPutPath="/api/siteinfo"
                dataKey="terms"
                pageTitle="Terms & Conditions Management"
                backRoute="/admin/siteinfo"
            />
        </div>
    );
}
