// Realistic Enterprise IDP Sample Documents for instant demo & processing

export const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-inv-001',
    fileName: 'Apex_Cloud_Tax_Invoice_INV-2025-0842.pdf',
    fileSize: '482 KB',
    mimeType: 'application/pdf',
    createdAt: '2025-09-15T10:30:00Z',
    documentType: 'Tax Invoice',
    documentCategory: 'Financial',
    confidenceScore: 0.984,
    status: 'VALIDATED',
    processingTimeMs: 1240,
    pageCount: 1,
    summary: 'Tax Invoice from Apex Cloud Technologies Pvt Ltd billed to Enterprise Solutions Inc for Q3 Kubernetes & GPU Cloud Infrastructure hosting.',
    extractedData: {
      vendor_name: 'Apex Cloud Technologies Pvt Ltd',
      vendor_address: 'Suite 900, Cyber City, Bangalore, KA 560100',
      vendor_gstin: '29AABCA1234F1Z9',
      vendor_email: 'billing@apexcloud.io',
      customer_name: 'Enterprise Solutions Inc',
      customer_address: '450 Innovation Parkway, San Jose, CA 95134',
      customer_tax_id: 'US-94-3829102',
      invoice_number: 'INV-2025-0842',
      invoice_date: '2025-09-15',
      due_date: '2025-10-15',
      payment_terms: 'Net 30 Days',
      currency: 'USD',
      subtotal: '4,200.00',
      tax_rate: '18%',
      tax_amount: '756.00',
      total_amount: '4,956.00',
      payment_method: 'Wire Transfer / ACH',
      bank_account: '•••• •••• •••• 9842',
      swift_code: 'APEXUS33XXX',
    },
    fieldConfidences: {
      vendor_name: 0.99,
      vendor_gstin: 0.98,
      invoice_number: 0.99,
      invoice_date: 0.98,
      due_date: 0.95,
      subtotal: 0.99,
      tax_amount: 0.97,
      total_amount: 0.99,
      customer_name: 0.96,
      payment_terms: 0.92,
      bank_account: 0.88,
    },
    tables: [
      {
        tableName: 'Line Items',
        headers: ['Item Description', 'Qty', 'Unit Price ($)', 'Tax (%)', 'Total Amount ($)'],
        rows: [
          { description: 'Dedicated Kubernetes Cluster (8 Nodes, 64 vCPU)', qty: '1', unitPrice: '2,400.00', tax: '18%', total: '2,400.00' },
          { description: 'NVIDIA H100 GPU Instance Reservation (120 hrs)', qty: '120', unitPrice: '12.50', tax: '18%', total: '1,500.00' },
          { description: 'High-Throughput NVMe Block Storage (5 TB)', qty: '5', unitPrice: '60.00', tax: '18%', total: '300.00' },
        ],
      }
    ],
    validationRules: [
      { id: 'v1', name: 'Mathematical Sum Consistency', rule: 'Sum of Line Items == Subtotal ($4,200.00)', status: 'PASSED', severity: 'HIGH' },
      { id: 'v2', name: 'Tax Computation Check', rule: 'Subtotal ($4,200.00) * 18% == Tax ($756.00)', status: 'PASSED', severity: 'HIGH' },
      { id: 'v3', name: 'Grand Total Reconciliation', rule: 'Subtotal ($4,200.00) + Tax ($756.00) == Total ($4,956.00)', status: 'PASSED', severity: 'HIGH' },
      { id: 'v4', name: 'GSTIN / Tax ID Format Check', rule: 'Matches Indian GSTIN regex ^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$', status: 'PASSED', severity: 'MEDIUM' },
      { id: 'v5', name: 'Date Sequence Check', rule: 'Invoice Date <= Due Date', status: 'PASSED', severity: 'MEDIUM' },
    ],
    entities: [
      { text: 'Apex Cloud Technologies Pvt Ltd', label: 'ORGANIZATION', confidence: 0.99 },
      { text: '29AABCA1234F1Z9', label: 'TAX_ID', confidence: 0.98 },
      { text: 'INV-2025-0842', label: 'INVOICE_ID', confidence: 0.99 },
      { text: '$4,956.00', label: 'MONEY', confidence: 0.99 },
      { text: '2025-09-15', label: 'DATE', confidence: 0.98 },
    ],
    rawOcrText: `TAX INVOICE
Apex Cloud Technologies Pvt Ltd
Suite 900, Cyber City, Bangalore, KA 560100
GSTIN: 29AABCA1234F1Z9 | billing@apexcloud.io

Billed To:
Enterprise Solutions Inc
450 Innovation Parkway, San Jose, CA 95134
Tax ID: US-94-3829102

Invoice #: INV-2025-0842
Invoice Date: 2025-09-15
Due Date: 2025-10-15
Payment Terms: Net 30 Days

Line Items:
1. Dedicated Kubernetes Cluster (8 Nodes, 64 vCPU) | Qty: 1 | Rate: $2,400.00 | Total: $2,400.00
2. NVIDIA H100 GPU Instance Reservation (120 hrs) | Qty: 120 | Rate: $12.50 | Total: $1,500.00
3. High-Throughput NVMe Block Storage (5 TB) | Qty: 5 | Rate: $60.00 | Total: $300.00

Subtotal: $4,200.00
GST @ 18%: $756.00
Grand Total: $4,956.00

Payment Details:
Bank: Silicon Valley Commercial Bank
Account: •••• •••• •••• 9842
SWIFT: APEXUS33XXX`,
  },
  {
    id: 'doc-legal-002',
    fileName: 'Mutual_Non_Disclosure_Agreement_Globex_2025.pdf',
    fileSize: '620 KB',
    mimeType: 'application/pdf',
    createdAt: '2025-09-18T14:20:00Z',
    documentType: 'Legal Contract (NDA)',
    documentCategory: 'Legal',
    confidenceScore: 0.965,
    status: 'VALIDATED',
    processingTimeMs: 1480,
    pageCount: 3,
    summary: 'Mutual Non-Disclosure Agreement between Globex Innovations LLC and Nexus Dynamics Inc with a 2-year confidentiality term and Delaware jurisdiction.',
    extractedData: {
      contract_title: 'Mutual Non-Disclosure and Confidentiality Agreement',
      disclosing_party: 'Globex Innovations LLC',
      receiving_party: 'Nexus Dynamics Inc',
      effective_date: '2025-10-01',
      expiration_date: '2027-10-01',
      term_duration: '2 Years from Effective Date',
      governing_law: 'State of Delaware, United States',
      dispute_resolution: 'Binding Arbitration (AAA Rules, Wilmington DE)',
      liability_cap: '$1,000,000 USD',
      non_solicitation_clause: 'Included (12 months post-termination)',
      ip_ownership: 'Each party retains sole title and intellectual property rights',
      authorized_signatory_party_a: 'Marcus Vance (Chief Executive Officer)',
      authorized_signatory_party_b: 'Elena Rostova (Chief Technology Officer)',
    },
    fieldConfidences: {
      contract_title: 0.99,
      disclosing_party: 0.98,
      receiving_party: 0.97,
      effective_date: 0.96,
      expiration_date: 0.94,
      governing_law: 0.98,
      liability_cap: 0.92,
      non_solicitation_clause: 0.91,
    },
    validationRules: [
      { id: 'v1', name: 'Dual Party Signature Check', rule: 'Both Disclosing and Receiving Signatories Identified', status: 'PASSED', severity: 'HIGH' },
      { id: 'v2', name: 'Jurisdiction Validation', rule: 'Governing Law unambiguously specified', status: 'PASSED', severity: 'HIGH' },
      { id: 'v3', name: 'Termination Term Validity', rule: 'Effective date precedes expiration date', status: 'PASSED', severity: 'HIGH' },
    ],
    entities: [
      { text: 'Globex Innovations LLC', label: 'ORGANIZATION', confidence: 0.99 },
      { text: 'Nexus Dynamics Inc', label: 'ORGANIZATION', confidence: 0.98 },
      { text: 'Delaware', label: 'GPE / JURISDICTION', confidence: 0.99 },
      { text: '$1,000,000 USD', label: 'MONEY', confidence: 0.95 },
    ],
    rawOcrText: `MUTUAL NON-DISCLOSURE AGREEMENT
This Agreement is entered into effective October 1, 2025, by and between Globex Innovations LLC and Nexus Dynamics Inc.
1. Confidential Information: Both parties agree to protect proprietary code, architecture, and algorithms.
2. Term: The confidentiality obligations shall survive for a period of 2 (two) years.
3. Governing Law: State of Delaware.
4. Liability Cap: In no event shall liability exceed $1,000,000 USD.`,
  },
  {
    id: 'doc-med-003',
    fileName: 'Comprehensive_Metabolic_Panel_Report_Morgan.pdf',
    fileSize: '310 KB',
    mimeType: 'application/pdf',
    createdAt: '2025-09-22T08:15:00Z',
    documentType: 'Medical Diagnostic Report',
    documentCategory: 'Healthcare',
    confidenceScore: 0.972,
    status: 'VALIDATED',
    processingTimeMs: 980,
    pageCount: 1,
    summary: 'Clinical laboratory diagnostic blood panel for patient Alex Morgan showing normal fasting glucose, electrolytes, and liver function indices.',
    extractedData: {
      patient_name: 'Alex Morgan',
      patient_id: 'MRN-884920',
      date_of_birth: '1988-04-12',
      gender: 'Female',
      collection_date: '2025-09-21 07:45 AM',
      ordering_physician: 'Dr. Robert Sterling, MD (Internal Medicine)',
      facility_name: 'Metropolitan Clinical Laboratories',
      fasting_glucose: '92 mg/dL (Normal: 70-99)',
      hba1c: '5.4% (Normal: < 5.7%)',
      total_cholesterol: '182 mg/dL (Desirable: < 200)',
      creatinine: '0.85 mg/dL (Normal: 0.5-1.1)',
      overall_interpretation: 'All metabolic parameters within normal reference ranges.',
    },
    fieldConfidences: {
      patient_name: 0.99,
      patient_id: 0.98,
      fasting_glucose: 0.97,
      hba1c: 0.98,
      total_cholesterol: 0.96,
      creatinine: 0.94,
    },
    tables: [
      {
        tableName: 'Biochemical Biomarkers',
        headers: ['Biomarker / Assay', 'Observed Value', 'Reference Range', 'Units', 'Flag'],
        rows: [
          { description: 'Fasting Serum Glucose', qty: '92', unitPrice: '70 - 99', tax: 'mg/dL', total: 'NORMAL' },
          { description: 'Hemoglobin A1c', qty: '5.4', unitPrice: '< 5.7', tax: '%', total: 'NORMAL' },
          { description: 'Serum Creatinine', qty: '0.85', unitPrice: '0.50 - 1.10', tax: 'mg/dL', total: 'NORMAL' },
          { description: 'Blood Urea Nitrogen (BUN)', qty: '14.0', unitPrice: '7 - 20', tax: 'mg/dL', total: 'NORMAL' },
          { description: 'Sodium (Electrolytes)', qty: '140', unitPrice: '136 - 145', tax: 'mmol/L', total: 'NORMAL' },
        ],
      }
    ],
    validationRules: [
      { id: 'v1', name: 'Reference Range Boundary Check', rule: 'All 5 biomarker assays within physiological boundaries', status: 'PASSED', severity: 'HIGH' },
      { id: 'v2', name: 'Patient Identifier Consistency', rule: 'MRN matches accession record format', status: 'PASSED', severity: 'HIGH' },
    ],
    entities: [
      { text: 'Alex Morgan', label: 'PERSON', confidence: 0.99 },
      { text: 'MRN-884920', label: 'MEDICAL_RECORD_NO', confidence: 0.98 },
      { text: 'Dr. Robert Sterling, MD', label: 'PERSON', confidence: 0.97 },
    ],
    rawOcrText: `METROPOLITAN CLINICAL LABORATORIES
Patient: Alex Morgan | MRN: MRN-884920 | DOB: 1988-04-12 | Gender: F
Ordering: Dr. Robert Sterling, MD | Collected: 2025-09-21 07:45 AM

COMPREHENSIVE METABOLIC PANEL:
- Glucose, Fasting: 92 mg/dL (Ref: 70 - 99 mg/dL) [NORMAL]
- Hemoglobin A1c: 5.4 % (Ref: < 5.7 %) [NORMAL]
- Creatinine, Serum: 0.85 mg/dL (Ref: 0.50 - 1.10 mg/dL) [NORMAL]
- BUN: 14 mg/dL (Ref: 7 - 20 mg/dL) [NORMAL]
- Sodium: 140 mmol/L (Ref: 136 - 145 mmol/L) [NORMAL]`,
  },
  {
    id: 'doc-rev-004',
    fileName: 'Fleet_Logistics_Receipt_Warning_FLAGGED.pdf',
    fileSize: '195 KB',
    mimeType: 'application/pdf',
    createdAt: '2025-09-24T16:45:00Z',
    documentType: 'Expense Receipt',
    documentCategory: 'Financial',
    confidenceScore: 0.742,
    status: 'REVIEW_NEEDED',
    processingTimeMs: 1120,
    pageCount: 1,
    summary: 'Flagged fuel receipt with low OCR clarity on total tax line requiring human-in-the-loop review.',
    extractedData: {
      merchant_name: 'Metro Fleet Fuel & Cargo Station',
      receipt_id: 'REC-90142',
      transaction_date: '2025-09-24',
      fuel_liters: '85.4 L',
      price_per_liter: '$1.45',
      fuel_subtotal: '$123.83',
      tax_amount: '$18.57', // Low confidence OCR
      total_charge: '$142.40',
      payment_card: 'VISA •••• 4129',
    },
    fieldConfidences: {
      merchant_name: 0.94,
      receipt_id: 0.89,
      transaction_date: 0.95,
      fuel_liters: 0.91,
      fuel_subtotal: 0.88,
      tax_amount: 0.58, // LOW CONFIDENCE
      total_charge: 0.93,
    },
    validationRules: [
      { id: 'v1', name: 'OCR Clarity Threshold Check', rule: 'Field tax_amount confidence (58%) below 70% threshold', status: 'WARNING', severity: 'HIGH' },
      { id: 'v2', name: 'Math Cross-Check', rule: 'Subtotal ($123.83) + Tax ($18.57) == Total ($142.40)', status: 'PASSED', severity: 'MEDIUM' },
    ],
    entities: [
      { text: 'Metro Fleet Fuel', label: 'ORGANIZATION', confidence: 0.94 },
      { text: '$142.40', label: 'MONEY', confidence: 0.93 },
    ],
    rawOcrText: `METRO FLEET FUEL
Receipt #: REC-90142 | Date: 2025-09-24
Fuel (Diesel): 85.4L @ $1.45/L = $123.83
Tax (Smudged text): $18.57?
TOTAL PAID: $142.40
Card: VISA 4129`,
  }
];

export const MOCK_DASHBOARD_METRICS = {
  totalProcessed: 1482,
  successfullyProcessed: 1429,
  accuracyRate: 98.6,
  requiringReview: 8,
  processingSpeedAvg: '1.1s',
  totalExportedJSON: 1210,
  zeroRetentionWipes: 1482,
  activityHistory: [
    { date: 'Mon', processed: 184, validated: 179, review: 5 },
    { date: 'Tue', processed: 242, validated: 236, review: 6 },
    { date: 'Wed', processed: 310, validated: 302, review: 8 },
    { date: 'Thu', processed: 285, validated: 279, review: 6 },
    { date: 'Fri', processed: 340, validated: 334, review: 6 },
    { date: 'Sat', processed: 65, validated: 63, review: 2 },
    { date: 'Sun', processed: 56, validated: 56, review: 0 },
  ],
  typeDistribution: [
    { name: 'Invoices & Receipts', count: 652, percentage: 44, color: '#00D2FF' },
    { name: 'Legal Contracts & NDAs', count: 355, percentage: 24, color: '#2563EB' },
    { name: 'Medical Reports', count: 267, percentage: 18, color: '#38BDF8' },
    { name: 'IDs & Forms', count: 208, percentage: 14, color: '#818CF8' },
  ],
};
