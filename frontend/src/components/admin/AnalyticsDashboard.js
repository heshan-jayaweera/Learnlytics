import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import AnalyticsDashboardCharts from './AnalyticsDashboardCharts';
import PowerBIEmbed from '../PowerBIEmbed';

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
          <Nav.Item>
            <Nav.Link 
              eventKey="powerbi"
              className={`text-black hover:text-accent-alt transition-colors duration-200 border-0 ${
                activeTab === 'powerbi' 
                  ? 'bg-white text-accent-alt border-b-2 border-accent-alt' 
                  : 'hover:bg-white/50'
              }`}
            >
              Power BI (Optional)
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="charts">
            <AnalyticsDashboardCharts />
          </Tab.Pane>
          <Tab.Pane eventKey="powerbi">
            <div className="alert alert-info bg-accent/20 border-accent/50 text-accent">
              <strong className="text-accent">Power BI Setup:</strong> <span className="text-black">To use Power BI embedding, you need either:</span>
              <ul className="mb-0 mt-2 text-black">
                <li><strong className="text-white">Power BI Embedded (Azure)</strong> - Pay-as-you-go, no Pro license needed (Recommended)</li>
                <li><strong className="text-white">Power BI Pro/Premium</strong> - Per-user license</li>
              </ul>
              <p className="mb-0 mt-2 text-black">
                See <code className="text-accent">POWER_BI_OPTIONS.md</code> for details. The Interactive Charts tab works without any Power BI setup!
              </p>
            </div>
            <PowerBIEmbed />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default AnalyticsDashboard;

