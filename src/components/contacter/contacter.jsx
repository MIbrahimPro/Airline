import React, { useEffect, useState } from "react";
import './whatsaap.scss'
import axios from "axios";




export default function Contacter() {


    const [contactWA, setContactWA] = useState('');


    useEffect(() => {
        axios
            .get('/api/siteinfo/public/contact')
            .then((response) => {
                setContactWA(response.data.contactWA)
            })
            .catch((err) => {
                console.log(err);
            })



    }, [])

    return (
        <>
            <a href={`https://wa.me/${contactWA.replace(/[\s+]/g, '')}`} className="Bloating-Whatsaap">
                <img src="./icons/wa_w.svg" alt="wa" ></img>
            </a>
        </>
    )
}
