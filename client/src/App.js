import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar component
import AdminHomePage from './components/AdminHomePage'; // Import the AdminHomePage component

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={AdminHomePage} />
          {/* <Route path="/create-election" component={CreateElectionPage} />
          <Route path="/view-election" component={ViewElectionPage} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
