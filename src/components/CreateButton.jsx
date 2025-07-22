import React from "react";
import { FaEnvelope } from "react-icons/fa";
import "./Navigationn.css";
const CreateButton = ({ onClick }) => {
    return (
        <div className="auth-button-container">
            <button 
                onClick={onClick}
                className="premium-create-button"
            >
                <span className="button-glow"></span>
                <span className="button-content">
                    <span className="button-icon">
                        <FaEnvelope />
                    </span>
                    <span className="button-text">CREATE</span>
                </span>
            </button>
        </div>
    );
};

export default CreateButton;