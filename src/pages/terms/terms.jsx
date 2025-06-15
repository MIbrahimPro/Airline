import React from "react";
import SiteInfoPage from "../../components/SiteInfoPage/SiteInfoPage";

export default function TermsPage() {
    return (
        <SiteInfoPage
            apiPath="/api/siteinfo/public/terms"
            selectedPage="terms"
            pageTitle="Terms & Conditions"
        />
    );
}
