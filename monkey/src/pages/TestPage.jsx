import React from "react"
import Navbar from "../component/Navbar"
import "./TestPage.css";
import QuizM from "../component/QuizM";
function TestPage()
{
    return(
        <>
        <div className="TestPage"></div>
        <div className="con">
            <Navbar/>
        </div>
        <div className="QM">
            <QuizM/>
        </div>
        </>
    )
}

export default TestPage