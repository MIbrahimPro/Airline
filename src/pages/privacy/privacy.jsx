// src/pages/PrivacyPolicy.jsx
import React from "react";
import SiteInfoPage from "../../components/SiteInfoPage/SiteInfoPage";

export default function PrivacyPolicy() {
    return (
        <SiteInfoPage
            apiPath="/api/siteinfo/public/privacy"
            selectedPage="privacy"
            pageTitle="Privacy Policy"
        />
    );
}
