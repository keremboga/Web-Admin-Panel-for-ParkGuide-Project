
import React from 'react';
import Layout from '../Layout/Layout'; 
import './Dashboard.css';
import JourneyList from '../JourneyList/JourneyList';

const Dashboard = () => {
  return (
    <Layout>
      <div className="dashboard">
        <h1>Journeys</h1>
        <JourneyList>
          
        </JourneyList>
      </div>
    </Layout>
  );
};

export default Dashboard;
