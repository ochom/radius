import React, { useState } from 'react';
import profile from './static/profile.jpg';
import './App.css';

function Sidenav() {
  const [active, setActive] = useState(true)
  return (
    <div className={`sidebar${active ? ' active' : ''}`}>
      <div className="logo_content">
        <div className="logo">
          <i className='bx bxl-sketch' ></i>
          <div className="logo_name">Radius</div>
        </div>
        <i className='bx bx-menu' id="btn" onClick={() => setActive(!active)}></i>
      </div>
      <ul className="nav_list">
        <li>
          <i className="bx bx-search" onClick={() => setActive(!active)}></i>
          <input type="text" placeholder="Search" />
          <span className="tooltip">Search</span>
        </li>
        <li>
          <a href="/">
            <i className="bx bx-grid-alt"></i>
            <span className="links_name">Dashboard</span>
          </a>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bx-chat' ></i>
            <span className="links_name">SMS</span>
          </a>
          <span className="tooltip">Messages</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bxs-school' ></i>
            <span className="links_name">Classess</span>
          </a>
          <span className="tooltip">Classess</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bx-user' ></i>
            <span className="links_name">Staffs</span>
          </a>
          <span className="tooltip">Staffs</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bx-group' ></i>
            <span className="links_name">Students</span>
          </a>
          <span className="tooltip">Students</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bxs-user-account'></i>
            <span className="links_name">Parents</span>
          </a>
          <span className="tooltip">Parents</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bxs-graduation' ></i>
            <span className="links_name">Examination</span>
          </a>
          <span className="tooltip">Examination</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bx-money' ></i>
            <span className="links_name">Finance</span>
          </a>
          <span className="tooltip">Finance</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bxs-book-bookmark'></i>
            <span className="links_name">Library</span>
          </a>
          <span className="tooltip">Library</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bx-trophy' ></i>
            <span className="links_name">Activity</span>
          </a>
          <span className="tooltip">Activity</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bxs-business' ></i>
            <span className="links_name">Welfare</span>
          </a>
          <span className="tooltip">Welfare</span>
        </li>
        <li>
          <a href="/">
            <i className='bx bx-cog' ></i>
            <span className="links_name">Settings</span>
          </a>
          <span className="tooltip">Settings</span>
        </li>
      </ul>
      <div className="profile_content">
        <div className="profile">
          <div className="profile_details">
            <img src={profile} alt="Profile" />
            <div className="name_job">
              <div className="name">Richard Ochom</div>
              <div className="job">Class Teacher, Form 4</div>
            </div>
          </div>
          <i className='bx bx-log-out' id="log_out" ></i>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <div className="home_content">
      <div className="topbar">
        <img src="https://media.istockphoto.com/vectors/black-and-white-illustration-of-a-school-logo-vector-id1136343416?k=6&m=1136343416&s=170667a&w=0&h=sztUR6SSjxwCNjRhfJGmdVoIbGUTADrbDde98A_x4qc=" alt="brand" className="school_brand" />
        <b className="school_name">Demo Secondary School</b>
      </div>
    </div>
  )
}

export { Sidenav, HomeContent };
