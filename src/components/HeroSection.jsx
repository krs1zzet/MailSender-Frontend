import React, { useEffect } from "react";
import FlowChart from './FlowChart';
import "./Navigationn.css";
import Istatistik from "./Istatistik/Istatistik";
import Yazi from "./TextBlock";
import AOS from 'aos';
import 'aos/dist/aos.css';
import TextBlock from "./TextBlock";

const HeroSection = ({ openAuthModal }) => {
    useEffect(() => {
        AOS.init({
            duration: 500,
            once: true, 
            offset: 100,
            easing: 'ease-in-out', 
        });
    }, []);

    return (
        <>
           
            <div data-aos="fade-up" data-aos-duration="1200">
                <Istatistik openAuthModal={openAuthModal} />
            </div>
            
            {/* Yazı bölümü - soldan slide in */}
           
                <TextBlock />
            
            
            {/* SVG container - zoom in effect */}
            <div className="container">
                <div className="ok" >
                    <svg
                        width={300}
                        height={300}
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M50 50 L100 100 L150 50 L130 30 L100 60 L70 30 Z M50 100 L100 150 L150 100 L130 80 L100 110 L70 80 Z"
                            fill="#002574ff"
                        />
                    </svg>
                </div>
            </div>
            
    
         
                <FlowChart />
    
        </>
    );
};

export default HeroSection;