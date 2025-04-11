import React from 'react';
import { useNavigate } from 'react-router-dom';
import './about_us_style.css';
import defaultImg from './default.jpg';

const AboutUs = () => {
const navigate = useNavigate();
  return (
    <div id="bg">
      <div className="content">
        <h1 className="font2">About Us!</h1>
        <p className="font1">Made by 3 underpaid interns at MonkeyQuiz</p>
        <p className="font1">With a mission to help your children have personalized growth, for parents who wish for it.</p>
        <p className="font1">Designed to even make monkeys learn.</p>

        <h3 className="font2">Our Mission</h3>
        <p className="font1">In recent times, children get cut off from personalized attention because of heavy tuition fees.</p>
        <p className="font1">We aim to directly provide that through our unique software—free of cost!</p>

        <h3 className="font2">Our Team</h3>
        <p className="font1">Our team consists of only three, introducing:</p>

        <div className="team">
          <div className="member">
            <img src={defaultImg} alt="placeholder" className="center" />
            <p className="font1">Name: Parth Patil</p>
            <br></br>
            <p className="font1">Most overworked, least underpaid</p>
          </div>

          <div className="member">
            <img src={defaultImg} alt="placeholder" className="center" />
            <p className="font1">Name: Nihar Sudheer</p>
            <br></br>
            <p className="font1">Me</p>
          </div>

          <div className="member">
            <img src={defaultImg} alt="placeholder" className="center" />
            <p className="font1">Name: Parth Mhatre</p>
            <br></br>
            <p className="font1">idk who this is, he just types something and we don't look</p>
          </div>
        </div>
      </div>
      <button className="button back" onClick={() => navigate("/Testpage")}>
          ⬅ Back to Main Page
        </button>
    </div>
  );
};

export default AboutUs;
