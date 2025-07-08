import React from "react";
import ClassActionModule from "../ClassActionModule/ClassActionModule";


export default function EmptyDashboard({ classActionModal, toggleClassAction, addCourseModal, updateCourseName, addClass, currentClassName}) {
    return (
        <>
            {/* Add an image here*/}
            <h1>Add your first add course</h1>
            <button onClick={toggleClassAction}>
                {/* Create context for easier data flow as app grows */}
                Add Course
            </button>
            {classActionModal && <ClassActionModule addClass={addClass} updateCourseName={updateCourseName} toggleClassAction={toggleClassAction}  />} 
        </>
    )
}