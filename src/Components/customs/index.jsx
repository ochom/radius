import { AdminPanelSettings, Mail, Menu as MenuIcon, Notifications } from '@mui/icons-material';
import { AppBar, Avatar, Badge, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { logout } from '../../reducers/auth-reducer';
import profile from "../../static/profile.jpg";


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

  let dispatch = useDispatch()

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = () => {
    dispatch(logout())
  };


  const settings = [{ title: 'Profile', action: handleClose }, { title: 'Account', action: handleClose }, { title: 'Logout', action: signOut }];

  return (
    <Box className="topbar">
      <AppBar position="static" sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleSideNav}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#9c27b0" }}>
            {user.school.name}
          </Typography>

          <Box>
            <Badge badgeContent={0} color="secondary" sx={{ mr: 3 }}>
              <AdminPanelSettings color="action" />
            </Badge>
            <Badge badgeContent={0} showZero color="secondary" sx={{ mr: 3 }}>
              <Notifications color="action" />
            </Badge>
            <Badge badgeContent={0} showZero color="secondary" sx={{ mr: 3 }}>
              <Mail color="action" />
            </Badge>
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
    <Box className="page_body" sx={{ position: 'absolute', mt: '3px', height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
      <Container sx={{ my: 5, top: 0 }}>{children}</Container>
    </Box>
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
    href: "/examination",
    icon: "bx bxs-graduation",
    title: "Examination",
    tooltip: "Examination",
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
    href: "/welfare",
    icon: "bx bxs-hotel",
    title: "Welfare",
    tooltip: "Welfare",
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

const DefaultPageLayout = (props) => {
  const { children } = props


  const user = useSelector(state => state.auth.user)
  const [active, setActive] = useState(false)

  const toggleSideNav = () => {
    setActive(!active)
  }

  return (
    <React.Fragment>
      <Sidenav active={active} />
      <div className="home_content">
        <TopBar user={user} toggleSideNav={toggleSideNav} />
        {children}
      </div>
    </React.Fragment>
  );
}

export { SubMenu, PageBody };

export default DefaultPageLayout