import React, { useState } from 'react';
import Signup from './components/Authentication/Signup';
import Login from './components/Authentication/Login';
import Dashboard from './components/User/Dashboard';
import loginService from './services/login';
import signupService from './services/signup';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Checks if user is logged in
  const checkLoggedUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      return user;
    } else {
      return null;
    }
  };

  const [user, setUser] = useState(checkLoggedUser);
  const [errorMessage, setErrorMessage] = useState(null);

  const history = useHistory();

  // Log in user and store the returned token
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));

      setUser(user);
      history.push('/dashboard');
    } catch (exception) {
      // Empties fields
      setUsername('');
      setPassword('');

      // Sets the error from server response
      setErrorMessage(exception.response.data.error);
    }
  };

  // Sign up user
  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      await signupService.signup({
        username,
        password,
        email,
      });

      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));

      setUser(user);
      console.log(`Logged in as: ${user.username}`);
      history.push('/dashboard');
    } catch (exception) {
      // Empties fields
      setUsername('');
      setPassword('');
      setEmail('');

      // Sets the error from server response
      console.log(exception.response.data.error);
      setErrorMessage(exception.response.data.error);
    }
  };

  return (
    <div>
      <Switch>
        <Route exact path="/signup">
          {user === null ? (
            <Signup
              username={username}
              password={password}
              email={email}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleEmailChange={({ target }) => setEmail(target.value)}
              handleSubmit={handleSignup}
              errorMessage={errorMessage}
            />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </Route>
        <Route exact path="/login">
          {user === null ? (
            <Login
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
              errorMessage={errorMessage}
            />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </Route>

        <Route path="/dashboard">
          {user === null ? <Redirect to="/login" /> : <Dashboard user={user} />}
        </Route>
        <Route exact path="/">
          {user === null ? (
            <Redirect to="/login" />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </Route>
        <Route
          path="*"
          exact={true}
          component={() => <h1>Does not exist</h1>}
        />
      </Switch>
    </div>
  );
};

export default App;
