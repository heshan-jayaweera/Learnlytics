import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import AnalyticsDashboardCharts from './AnalyticsDashboardCharts';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('charts');

  return (
    <div>
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3 border-b border-primary/30">
          <Nav.Item>
            <Nav.Link 
              eventKey="charts"
              className={`text-black hover:text-accent transition-colors duration-200 border-0 ${
                activeTab === 'charts' 
                  ? 'bg-white text-accent border-b-2 border-accent' 
                  : 'hover:bg-white/50'
              }`}
            >
              Interactive Charts
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="charts">
            <AnalyticsDashboardCharts />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default AnalyticsDashboard;