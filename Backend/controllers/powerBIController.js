// Power BI Embed Token Controller
// This controller generates embed tokens for Power BI reports
// Note: This requires Power BI Service API setup

const axios = require('axios');

// Generate Power BI embed token
// Retrieves an Azure AD access token, fetches report details for embedUrl,
// and generates an embed token for the specified report.
const generateEmbedToken = async (req, res) => {
  try {
    // Power BI Service API configuration
    const clientId = process.env.POWER_BI_CLIENT_ID;
    const clientSecret = process.env.POWER_BI_CLIENT_SECRET;
    const tenantId = process.env.POWER_BI_TENANT_ID;
    const workspaceId = process.env.POWER_BI_WORKSPACE_ID;
    const reportId = process.env.POWER_BI_REPORT_ID;

    if (!clientId || !clientSecret || !tenantId || !workspaceId || !reportId) {
      return res.status(400).json({
        message: 'Power BI is not configured. Set POWER_BI_CLIENT_ID, POWER_BI_CLIENT_SECRET, POWER_BI_TENANT_ID, POWER_BI_WORKSPACE_ID, POWER_BI_REPORT_ID in Backend/.env',
        missing: {
          POWER_BI_CLIENT_ID: Boolean(clientId),
          POWER_BI_CLIENT_SECRET: Boolean(clientSecret),
          POWER_BI_TENANT_ID: Boolean(tenantId),
          POWER_BI_WORKSPACE_ID: Boolean(workspaceId),
          POWER_BI_REPORT_ID: Boolean(reportId)
        }
      });
    }

    // Get access token from Azure AD
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const tokenParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default',
    });

    const tokenResponse = await axios.post(tokenUrl, tokenParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch report details to get embedUrl
    const reportDetailsUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const reportResp = await axios.get(reportDetailsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const embedUrl = reportResp.data?.embedUrl || reportResp.data?.reportEmbedUrl || reportResp.data?.webUrl;

    // Generate embed token for the report
    const embedTokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;
    const embedTokenResponse = await axios.post(
      embedTokenUrl,
      { accessLevel: 'View', allowSaveAs: false },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      embedToken: embedTokenResponse.data.token,
      embedUrl,
      reportId,
      expiresOn: embedTokenResponse.data.expiration,
    });
  } catch (error) {
    const details = error.response?.data || error.message;
    console.error('Power BI token generation error:', details);
    const status = error.response?.status || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({
      message: 'Failed to generate Power BI embed token',
      error: details,
    });
  }
};

module.exports = {
  generateEmbedToken,
};

