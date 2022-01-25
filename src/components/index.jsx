import { AppBar, Avatar, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { Menu as MenuIcon } from '@mui/icons-material'
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { NavLink, Redirect } from "react-router-dom";
import profile from "../static/profile.jpg";

function SubMenu({ titleIcon, titleName, items }) {
  return (
    <div className="sub_menu">
      <div className="title_content">
        <i className={titleIcon}></i>
        <span>{titleName}</span>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <NavLink
              exact={item.exact}
              to={item.href}
              replace={true}
              activeClassName="selected"
            >
              <i className={item.icon}></i>
              <span>{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopBar(props) {
  const { user, toggleSideNav } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  let history = useHistory();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    history.push("/register");
  };


  const settings = [{ title: 'Profile', action: handleClose }, { title: 'Account', action: handleClose }, { title: 'Logout', action: logout }];

  return (
    <Box className="topbar">
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleSideNav}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {user.school.name}
          </Typography>

          <Box>
            <Tooltip title="Open settings" arrow>
              <IconButton onClick={handleOpen}>
                <Avatar alt={user.firstName} src={profile} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={setting.action}>
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function PageBody({ children }) {
  return (
    <div className="page_body">
      <div className="container-fluid mt-2 px-5 py-2">{children}</div>
    </div>
  );
}

const menuItems = [
  {
    href: "/",
    icon: "bx bx-grid-alt",
    title: "Dashboard",
    tooltip: "Dashboard",
    exact: true,
  },
  { href: "/sms", icon: "bx bx-chat", title: "SMS", tooltip: "Messages" },
  { href: "/teachers", icon: "bx bx-user", title: "Teachers", tooltip: "Teachers" },
  {
    href: "/classes",
    icon: "bx bxs-school",
    title: "Classrooms",
    tooltip: "Classrooms",
  },
  {
    href: "/students",
    icon: "bx bx-group",
    title: "Students",
    tooltip: "Students",
  },
  {
    href: "/academics",
    icon: "bx bxs-graduation",
    title: "Academics",
    tooltip: "Academics",
  },
  {
    href: "/finance",
    icon: "bx bx-money",
    title: "Finance",
    tooltip: "Finance",
  },
  {
    href: "/library",
    icon: "bx bx-book-open",
    title: "Library",
    tooltip: "Library",
  },
  {
    href: "/activity",
    icon: "bx bx-trophy",
    title: "Activity",
    tooltip: "Activity",
  },
  {
    href: "/accommodation",
    icon: "bx bxs-hotel",
    title: "Accommodation",
    tooltip: "Boarding",
  },
  {
    href: "/settings",
    icon: "bx bx-cog",
    title: "Settings",
    tooltip: "Settings",
  },
];

function Sidenav(props) {
  const { active } = props;


  return (
    <div className={`sidebar${active ? " activated" : ""}`}>
      <div className="logo_content">
        <div className="logo">
          <i className="bx bxl-sketch"></i>
          <div className="logo_name">Radius</div>
        </div>
      </div>
      <ul className="nav_list">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              exact={item.exact}
              activeClassName="selected"
              to={item.href}
              replace={true}
            >
              <i className={item.icon}></i>
              <span className="links_name">{item.title}</span>
            </NavLink>
            <span className="tooltip">{item.tooltip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DefaultPageLayout({ children }) {
  var user = null;
  var data = localStorage.getItem("authUser");
  const [active, setActive] = useState(false)
  if (data) {
    user = JSON.parse(data);
  }

  const toggleSideNav = () => {
    setActive(!active)
  }

  if (!user) {
    return <Redirect to="/register" />;
  }

  var token = user.token;
  if (!token) {
    return <Redirect to="/register" />;
  }

  return (
    <React.Fragment>
      <Sidenav
        email={user.email}
        name={`${user.firstName} ${user.lastName}`}
        active={active}
      />
      <div className="home_content">
        <TopBar user={user} toggleSideNav={toggleSideNav} />
        {children}
      </div>
    </React.Fragment>
  );
}

export { DefaultPageLayout, SubMenu, PageBody };
