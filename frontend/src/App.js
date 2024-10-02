import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Page from './Page';
import NavBar from './NavBar';
import LoginUser from './LoginForm';
import SignupUser from './Signup';
import { CardComponent } from './routesList';
import { useState, React, Fragment, useEffect } from "react";
import JoblyApi from './api';
import { Profile } from "./Profile";
import EditUser from './EditProfile';
import './App.css';



function App() {
  const [jobsApplied, setJobsApplied] = useState(localStorage.applied || '')
  const [currentUser, setCurrentUser] = useState(localStorage.user || null);
  const [token, setToken] = useState(localStorage.token || null);

  async function addUser(user) {
    try {
      
      // For registering user
      const response = await JoblyApi.register({
        username: user.username,
        password: user.password,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email
      });

      // Maintain the token state of current user
      setToken(response.token);
      setCurrentUser(response.username);

      // For keeping login of user active
      localStorage.user = response.username
      localStorage.token = response.token

      console.log(`User ${response.username} has been successfully registered!`);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async function login ({ username, password }) {
    try {
      const response = await JoblyApi.login(username, password);
      console.log(response)
      setToken(response.token);
      setCurrentUser(username);
      console.log("Successfully logged in!");
      localStorage.user = username
      localStorage.token = response.token
      localStorage.isAdmin = response.isAdmin
    } catch (error) {
      console.error("Login failed" + error);
    }
  }

  async function logout() {
    setCurrentUser(null);
    setToken(null);
    JoblyApi.token = null
    localStorage.clear()
  }

  async function editUser(user, username) {
    try {
      const response = await JoblyApi.patchUser({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email}, username, localStorage.token)

      console.log(`${response.username} has been successfully logged in!`);
    } catch (e) {}
  }

  return (
    <div className='app'>
      <BrowserRouter>
          <NavBar currentUser={currentUser} logout={logout} />
          <main>
            <Routes>
              <Route exact path="/" element={<Home />} />

              {localStorage.isAdmin &&
                <Route exact path="/users" element={<Page />} />
              }

              {currentUser == null ? (
                <Fragment>
                  <Route exact path="/login" element={<LoginUser login={login} />} />
                  <Route exact path="/signup" element={<SignupUser addUser={addUser} />} />
                </Fragment>
              ) : (

                <Fragment>
                  <Route exact path="/profile" element={<Profile currentUser={currentUser} token={token} />} />
                  <Route exact path="/logout" element={<Navigate to="/" replace onClick={logout} />} />

                  <Route exact path="/companies" element={<Page />} />
                  <Route exact path="/jobs" element={<Page />} />
                </Fragment>
              )}

              <Route exact path="/companies/:title" element={<CardComponent type="companies" jobsApplied={jobsApplied} />} />
              <Route exact path="/users/:username" element={<CardComponent type="users" />} />
              <Route exact path="/jobs/:id" element={<CardComponent type="jobs" />} />

              {localStorage.isAdmin == 'true' &&
                <Route exact path="/users" element={<CardComponent type="users" />} />
              }

              <Route path='/users/:username/edit' element={<EditUser editUser={editUser} currentUser={currentUser} token={token} />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
      </BrowserRouter>
    </div>
  );
}

export default App;