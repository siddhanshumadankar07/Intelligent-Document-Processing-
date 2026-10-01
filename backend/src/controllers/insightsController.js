const Document = require('../models/Document');
const { PROFESSION_DEFAULTS } = require('../config/schemas');

/**
 * Aggregated insights and charts data for the session dashboard
 */
const getDashboardInsights = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const documents = await Document.find({ sessionId: session._id });
    const userProfession = req.user.profession || 'Finance/Accounting';

    const totalDocs = documents.length;
    const approvedDocs = documents.filter((d) => d.status === 'Approved').length;
    const needsReviewDocs = documents.filter((d) => d.status === 'Needs Review').length;
    const rejectedDocs = documents.filter((d) => d.status === 'Rejected').length;

    const totalFlags = documents.reduce((sum, d) => sum + (d.flags ? d.flags.length : 0), 0);
    const avgConfidence = totalDocs > 0
      ? Math.round(documents.reduce((sum, d) => sum + (d.confidence || 0), 0) / totalDocs)
      : 100;

    // 1. Documents by Type (Donut chart)
    const typeCounts = {};
    documents.forEach((d) => {
      const t = (d.type || 'other').replace(/_/g, ' ');
      const label = t.charAt(0).toUpperCase() + t.slice(1);
      typeCounts[label] = (typeCounts[label] || 0) + 1;
    });
    const typeDistribution = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

    // 2. Status Breakdown (Bar chart)
    const statusDistribution = [
      { name: 'Approved', count: approvedDocs, fill: '#22C55E' },
      { name: 'Needs Review', count: needsReviewDocs, fill: '#F59E0B' },
      { name: 'Rejected', count: rejectedDocs, fill: '#EF4444' },
    ];

    // 3. Confidence Distribution (Histogram bins: 90-100, 80-89, 70-79, <70)
    const confidenceBins = [
      { range: '90-100%', count: documents.filter((d) => d.confidence >= 90).length },
      { range: '80-89%', count: documents.filter((d) => d.confidence >= 80 && d.confidence < 90).length },
      { range: '70-79%', count: documents.filter((d) => d.confidence >= 70 && d.confidence < 80).length },
      { range: '< 70%', count: documents.filter((d) => d.confidence < 70).length },
    ];

    // 4. Flags and Insights highlights
    const keyInsights = [];
    
    // Check financial sums
    let totalSpend = 0;
    let invoiceCount = 0;
    documents.forEach((d) => {
      if (d.type === 'invoice' || d.type === 'receipt' || d.type === 'purchase_order') {
        const amt = parseFloat(d.extractedData?.get?.('total_amount') || d.extractedData?.total_amount || 0);
        if (amt > 0) {
          totalSpend += amt;
          invoiceCount += 1;
        }
      }
    });

    if (totalSpend > 0) {
      keyInsights.push({
        type: 'info',
        title: `Total Document Value: $${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        description: `Aggregated total across ${invoiceCount} financial document(s) in this session.`,
        actionable: false,
      });
    }

    if (needsReviewDocs > 0) {
      keyInsights.push({
        type: 'warning',
        title: `${needsReviewDocs} Document(s) Require Human Review`,
        description: 'Validation anomalies or field confidence thresholds require attention.',
        actionable: true,
      });
    }

    const duplicates = documents.filter((d) => d.flags?.some((f) => f.message?.includes('duplicate')));
    if (duplicates.length > 0) {
      keyInsights.push({
        type: 'risk',
        title: `${duplicates.length} Potential Duplicate Document(s)`,
        description: 'Matching filenames or identical content found within this session.',
        actionable: true,
      });
    }

    // Profession specific widget metrics
    const defaults = PROFESSION_DEFAULTS[userProfession] || PROFESSION_DEFAULTS['Other'];

    return res.json({
      success: true,
      stats: {
        totalDocs,
        approvedDocs,
        needsReviewDocs,
        rejectedDocs,
        totalFlags,
        avgConfidence,
        totalSpend,
      },
      charts: {
        typeDistribution,
        statusDistribution,
        confidenceBins,
      },
      insights: keyInsights,
      profession: {
        current: userProfession,
        suggestedPrompts: defaults.suggestedPrompts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardInsights,
};
