// src/pages/PrivacyAdmin.jsx
import React from "react";
import SiteInfoAdmin from "../../components/SiteInfoAdmin/SiteInfoAdmin";
import "./privacyadmin.scss";

export default function PrivacyAdmin() {
    return (
        <SiteInfoAdmin
            apiGetPath="/api/siteinfo/admin/all"
            apiPutPath="/api/siteinfo"
            dataKey="privacyPolicy"
            pageTitle="Privacy Policy Management"
            backRoute="/admin/siteinfo"
        />
    );
}
