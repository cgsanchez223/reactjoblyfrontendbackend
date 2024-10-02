import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import "./NavBar.css";

function NavBar({ currentUser, logout }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        navigate('/');
    };

    return (
        <div>
            <Navbar expand="md">
                <NavLink exact to="/" className="nav-brand">
                    Jobly
                </NavLink>

                <Nav className="ml-auto navbar-nav" navbar>
                    {location.pathname !== "/login" && currentUser == null && (
                        <NavItem>
                            <NavLink to="/login" className="nav-link">
                                Login
                            </NavLink>
                        </NavItem>
                    )}

                    {location.pathname !== "/signup" && currentUser==null && (
                        <NavItem>
                            <NavLink to='/signup' className="nav-link">
                                Sign up
                            </NavLink>
                        </NavItem>
                    )}

                    {location.pathname !== "/logout" && currentUser && (
                        <NavItem>
                            <span onClick={handleLogout} className="nav-link" style={({ cursor: 'pointer' })}>
                                Logout
                            </span>
                        </NavItem>
                    )}

                    {location.pathname !== "/profile" && currentUser && (
                        <NavItem>
                            <NavLink to='/profile' className='nav-link' >
                                Profile
                            </NavLink>
                        </NavItem>
                    )}

                    {location.pathname !== "/companies" && localStorage.token && (
                        <NavItem>
                            <NavLink to="/companies" className="nav-link">
                                Companies
                            </NavLink>
                        </NavItem>
                    )}

                    {location.pathname !== "/jobs" && localStorage.token && (
                        <NavItem>
                            <NavLink to="/jobs" className="nav-link">
                                Jobs
                            </NavLink>
                        </NavItem>
                    )}

                    {location.pathname !== "/users" && localStorage.isAdmin && (
                        <NavItem>
                            <NavLink to="/users" className="nav-link">
                                Users
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
            </Navbar>
        </div>
    );
}

export default NavBar;