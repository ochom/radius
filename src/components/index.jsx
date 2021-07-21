import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import profile from "../static/profile.jpg"


function SubMenu(props) {
    return (
        <div className="sub_menu">
            <div className="title_content">
                <i className={props.titleIcon}></i>
                <span>{props.titleName}</span>
            </div>
            <ul>
                {props.items.map((item, index) =>
                    <li key={index}>
                        <NavLink exact={item.exact} to={item.href} replace={true} activeClassName="selected">
                            <i className={item.icon}></i>
                            <span>{item.title}</span>
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    )
}


function TopBar() {
    return (
        <div className="topbar">
            <img src="https://media.istockphoto.com/vectors/black-and-white-illustration-of-a-school-logo-vector-id1136343416?k=6&m=1136343416&s=170667a&w=0&h=sztUR6SSjxwCNjRhfJGmdVoIbGUTADrbDde98A_x4qc=" alt="brand" className="school_brand" />
            <b className="school_name">Demo Secondary School</b>
        </div>
    )
}

function PageBody({ children }) {
    return (
        <div className="page_body">
            <div className="container-fluid mt-2 px-5 py-2">
                {children}
            </div>
        </div>
    )
}

const menuItems = [
    { href: "/", icon: "bx bx-grid-alt", title: "Dashboard", tooltip: "Dashboard", exact: true },
    { href: "/sms", icon: "bx bx-chat", title: "SMS", tooltip: "Messages" },
    { href: "/staff", icon: "bx bx-user", title: "Staff", tooltip: "Staff" },
    { href: "/classes", icon: "bx bxs-school", title: "Classes", tooltip: "Classes" },
    { href: "/students", icon: "bx bx-group", title: "Students", tooltip: "Students" },
    { href: "/parents", icon: "bx bxs-user-account", title: "Parents", tooltip: "Parents" },
    { href: "/academics", icon: "bx bxs-graduation", title: "Academics", tooltip: "Academics" },
    { href: "/finance", icon: "bx bx-money", title: "Finance", tooltip: "Finance" },
    { href: "/library", icon: "bx bx-book-open", title: "Library", tooltip: "Library" },
    { href: "/activity", icon: "bx bx-trophy", title: "Activity", tooltip: "Activity" },
    { href: "/accomodation", icon: "bx bxs-hotel", title: "Accomodation", tooltip: "Boarding" },
    { href: "/settings", icon: "bx bx-cog", title: "Settings", tooltip: "Settings" },
]

function Sidenav() {
    const [active, setActive] = useState(true)
    return (
        <div className={`sidebar${active ? ' activated' : ''}`}>
            <div className="logo_content">
                <div className="logo">
                    <i className='bx bxl-sketch' ></i>
                    <div className="logo_name">Radius</div>
                </div>
                <i className='bx bx-menu' id="btn" onClick={() => setActive(!active)}></i>
            </div>
            <ul className="nav_list">
                {/* <li>
                    <i className="bx bx-search" onClick={() => setActive(!active)}></i>
                    <input type="text" placeholder="Search" />
                    <span className="tooltip">Search</span>
                </li> */}
                {menuItems.map((item, index) =>
                    <li key={index}>
                        <NavLink exact={item.exact} activeClassName="selected" to={item.href} replace={true}>
                            <i className={item.icon}></i>
                            <span className="links_name">{item.title}</span>
                        </NavLink>
                        <span className="tooltip">{item.tooltip}</span>
                    </li>
                )}
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

function DefaultPagelayout({ children }) {
    return (
        <React.Fragment>
            <Sidenav />
            <div className="home_content">
                <TopBar />
                {children}
            </div>
        </React.Fragment>
    )
}


export { DefaultPagelayout, SubMenu, PageBody }