const { query } = require('../config/database');

const getAnalytics = async (req, res) => {
  try {
    // 1. General Analytics
    const submissionsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM submissions
    `;
    
    const usersQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active
      FROM users
    `;

    const [submissionsResult, usersResult] = await Promise.all([
      query(submissionsQuery),
      query(usersQuery)
    ]);

    const submissionsStats = submissionsResult.rows[0];
    const usersStats = usersResult.rows[0];

    const analyticsData = {
      period: 'all-time',
      totalSubmissions: parseInt(submissionsStats.total),
      approvedSubmissions: parseInt(submissionsStats.approved),
      pendingSubmissions: parseInt(submissionsStats.pending),
      rejectedSubmissions: parseInt(submissionsStats.rejected),
      totalUsers: parseInt(usersStats.total),
      activeUsers: parseInt(usersStats.active),
      organizationActivity: 0 // Placeholder
    };

    // 2. Organization Stats
    const orgStatsQuery = `
      SELECT 
        o.id,
        o.name,
        o.acronym,
        COUNT(s.id) as submissions,
        COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_count,
        MAX(s.created_at) as last_activity
      FROM organizations o
      LEFT JOIN users u ON u.organization_id = o.id
      LEFT JOIN submissions s ON s.user_id = u.id
      GROUP BY o.id, o.name, o.acronym
    `;

    const orgStatsResult = await query(orgStatsQuery);
    
    const organizationStats = orgStatsResult.rows.map(org => {
      const total = parseInt(org.submissions);
      const approved = parseInt(org.approved_count);
      const approvalRate = total > 0 ? (approved / total) * 100 : 0;
      
      return {
        id: org.id,
        name: org.name,
        acronym: org.acronym,
        submissions: total,
        approvalRate: parseFloat(approvalRate.toFixed(1)),
        avgProcessingTime: 2.5, // Placeholder, requires more complex calculation
        lastActivity: org.last_activity || new Date().toISOString()
      };
    });

    // Calculate organization activity (percentage of orgs with at least one submission)
    const activeOrgs = organizationStats.filter(o => o.submissions > 0).length;
    analyticsData.organizationActivity = organizationStats.length > 0 
      ? Math.round((activeOrgs / organizationStats.length) * 100) 
      : 0;

    // 3. Submission Trends (Last 6 months)
    const trendsQuery = `
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        EXTRACT(MONTH FROM created_at) as month_num,
        COUNT(*) as submissions,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM submissions
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `;

    const trendsResult = await query(trendsQuery);
    
    const submissionTrends = trendsResult.rows.map(row => ({
      month: row.month,
      submissions: parseInt(row.submissions),
      approved: parseInt(row.approved),
      rejected: parseInt(row.rejected)
    }));

    res.json({
      success: true,
      data: {
        analyticsData,
        organizationStats,
        submissionTrends
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
};

module.exports = {
  getAnalytics
};
