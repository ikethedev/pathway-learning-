'use client'

import React, { useState } from "react";
import styles from "./DashboardHeader.module.css";
import ClassActionModule from "../ClassActionModule/ClassActionModule";

export default function DashboardHeader({ updateCourseName, classActionModal, toggleClassAction, addClass, currentClassName, addCourseModal}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        alert("sidebar toggled")
    };
    
   

    return (
        <header className={styles.dashboardHeader}>
            {/* Hamburger Menu */}
            <button
                className={`${styles.hamburgerMenu} ${isMenuOpen ? styles.isOpen : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMenuOpen}
            >
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
            </button>

            {/* Dashboard Home Title */}
            <h1 className={styles.dashboardTitle}>Dashboard Home</h1>

            {/* Add Class Button */}
            <button className={styles.addButton} onClick={toggleClassAction}>
                +
            </button>
            {classActionModal && <ClassActionModule addClass={addClass} updateCourseName={updateCourseName} toggleClassAction={toggleClassAction}/>}
        </header>
    );
}