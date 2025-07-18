import React from "react"
import Link from 'next/link';
import formCommonStyles from "../shared/FormStyles.module.css";
import shareUi from "../../global/sharedUi.module.css";
import styles from "../dashboard/dashboard.module.css"


export default function GoToDashBoard({ formData }){
    console.log(formData.name)
    const { name } = formData
    console.log(name)
    return (
        <div className={`${formCommonStyles['container']} ${shareUi['column']} ${styles['dashboard-container']}`}>
            <h1 className={formCommonStyles['step-header']}>Yor're all set {name}</h1>
            <Link className={`${shareUi['nav-buttons']} ${styles['nav-button']}`} href="/dashboard">
                Go to DashBoard
            </Link>
        </div>
    )
}