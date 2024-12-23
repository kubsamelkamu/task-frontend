import React from "react";
import withAuth from "../hoc/withAuth";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your protected dashboard!</p>
    </div>
  );
};

export default withAuth(Dashboard);
