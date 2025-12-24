import React, { useEffect, useRef, useState } from 'react';
import * as pbi from 'powerbi-client';
import api from '../services/api';

const PowerBIEmbed = () => {
  const embedContainerRef = useRef(null);
  const powerBIRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const embedReport = async () => {
      try {
        // Fetch embed token from backend
        const response = await api.get('/powerbi/embed-token');
        const { embedToken, embedUrl, reportId } = response.data;

        if (!embedToken || !embedUrl || !reportId) {
          throw new Error('Missing Power BI configuration');
        }

        // Power BI configuration
        const config = {
          type: 'report',
          tokenType: pbi.models.TokenType.Embed,
          accessToken: embedToken,
          embedUrl: embedUrl,
          id: reportId,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: true,
              },
              pageNavigation: {
                visible: true,
              },
            },
            background: pbi.models.BackgroundType.Transparent,
          },
        };

        if (embedContainerRef.current) {
          // Initialize Power BI service
          if (!powerBIRef.current) {
            powerBIRef.current = pbi.service.Service(powerBIRef.current);
          }

          // Embed the report
          const report = powerBIRef.current.embed(embedContainerRef.current, config);

          // Handle report load
          report.on('loaded', () => {
            console.log('Power BI report loaded');
            setLoading(false);
          });

          // Handle errors
          report.on('error', (event) => {
            console.error('Power BI error:', event.detail);
            setError('Failed to load Power BI report');
            setLoading(false);
          });
        }
      } catch (err) {
        console.error('Power BI embedding error:', err);
        setError(err.response?.data?.message || 'Power BI is not configured. See POWER_BI_SETUP.md for setup instructions.');
        setLoading(false);
        
        // Show placeholder if Power BI is not configured
        if (embedContainerRef.current) {
          embedContainerRef.current.innerHTML = `
            <div style="padding: 40px; text-align: center; background: #f5f5f5; border: 2px dashed #ccc;">
              <h5>Power BI Dashboard</h5>
              <p style="color: #666;">${error || 'Power BI is not configured'}</p>
              <p>To enable Power BI embedding:</p>
              <ol style="text-align: left; display: inline-block;">
                <li>Set up Power BI Service credentials</li>
                <li>Create a Power BI report with your student data</li>
                <li>Configure backend environment variables</li>
                <li>See POWER_BI_SETUP.md for detailed instructions</li>
              </ol>
            </div>
          `;
        }
      }
    };

    embedReport();

    // Cleanup
    return () => {
      if (powerBIRef.current && embedContainerRef.current) {
        try {
          powerBIRef.current.reset(embedContainerRef.current);
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, []);

  return (
    <div>
      {loading && (
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading Power BI report...</span>
          </div>
        </div>
      )}
      {error && !loading && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}
      <div
        ref={embedContainerRef}
        style={{
          width: '100%',
          height: '600px',
          minHeight: '400px',
        }}
      />
    </div>
  );
};

export default PowerBIEmbed;

