/**
 * Seed schemas for known document types & professions
 */
const SEED_SCHEMAS = {
  invoice: {
    documentType: 'invoice',
    category: 'Finance/Accounting',
    name: 'Standard Invoice',
    fields: [
      { key: 'invoice_number', label: 'Invoice #', type: 'string', required: true },
      { key: 'vendor_name', label: 'Vendor Name', type: 'string', required: true },
      { key: 'vendor_address', label: 'Vendor Address', type: 'string' },
      { key: 'customer_name', label: 'Customer Name', type: 'string', required: true },
      { key: 'invoice_date', label: 'Invoice Date', type: 'date', required: true },
      { key: 'due_date', label: 'Due Date', type: 'date' },
      { key: 'subtotal', label: 'Subtotal', type: 'number', required: true },
      { key: 'tax_amount', label: 'Tax Amount', type: 'number' },
      { key: 'total_amount', label: 'Total Amount', type: 'number', required: true },
      { key: 'currency', label: 'Currency', type: 'string', default: 'USD' },
      { key: 'payment_terms', label: 'Payment Terms', type: 'string' },
      { key: 'line_items', label: 'Line Items', type: 'array' }
    ],
    validationRules: [
      { rule: 'math_subtotal_tax_equals_total', description: 'Subtotal + Tax must equal Total Amount' },
      { rule: 'valid_dates', description: 'Due Date must be on or after Invoice Date' },
      { rule: 'non_negative_amounts', description: 'All currency values must be positive' }
    ]
  },
  contract: {
    documentType: 'contract',
    category: 'Legal',
    name: 'Legal Contract / Agreement',
    fields: [
      { key: 'title', label: 'Contract Title', type: 'string', required: true },
      { key: 'party_one', label: 'First Party (Discloser/Provider)', type: 'string', required: true },
      { key: 'party_two', label: 'Second Party (Recipient/Client)', type: 'string', required: true },
      { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
      { key: 'termination_date', label: 'Expiration / Termination Date', type: 'date' },
      { key: 'governing_law', label: 'Governing Law / Jurisdiction', type: 'string', required: true },
      { key: 'confidentiality_clause', label: 'Confidentiality Clause', type: 'string' },
      { key: 'liability_cap', label: 'Limitation of Liability', type: 'string' },
      { key: 'termination_notice_days', label: 'Notice Period (Days)', type: 'number' },
      { key: 'key_obligations', label: 'Key Obligations', type: 'array' }
    ],
    validationRules: [
      { rule: 'parties_distinct', description: 'First and second party must be distinct entities' },
      { rule: 'valid_term_dates', description: 'Termination date must be after Effective date' },
      { rule: 'governing_jurisdiction_set', description: 'Governing law must specify a recognized jurisdiction' }
    ]
  },
  resume: {
    documentType: 'resume',
    category: 'HR/Recruitment',
    name: 'Candidate Resume / CV',
    fields: [
      { key: 'candidate_name', label: 'Candidate Name', type: 'string', required: true },
      { key: 'email', label: 'Email Address', type: 'string', required: true },
      { key: 'phone', label: 'Phone Number', type: 'string' },
      { key: 'location', label: 'Location / City', type: 'string' },
      { key: 'headline', label: 'Professional Headline', type: 'string' },
      { key: 'total_experience_years', label: 'Total Experience (Years)', type: 'number' },
      { key: 'education', label: 'Highest Education', type: 'string' },
      { key: 'skills', label: 'Key Skills', type: 'array', required: true },
      { key: 'work_history', label: 'Work History', type: 'array' },
      { key: 'certifications', label: 'Certifications', type: 'array' }
    ],
    validationRules: [
      { rule: 'valid_email_format', description: 'Candidate email must be a valid email syntax' },
      { rule: 'experience_chronology', description: 'Employment dates should be in chronological order' }
    ]
  },
  medical_report: {
    documentType: 'medical_report',
    category: 'Healthcare',
    name: 'Medical / Lab Test Report',
    fields: [
      { key: 'patient_name', label: 'Patient Name', type: 'string', required: true },
      { key: 'patient_id', label: 'Patient / Record ID', type: 'string' },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
      { key: 'test_date', label: 'Test / Specimen Date', type: 'date', required: true },
      { key: 'test_name', label: 'Test / Panel Name', type: 'string', required: true },
      { key: 'referring_physician', label: 'Referring Physician', type: 'string' },
      { key: 'facility_name', label: 'Lab / Facility Name', type: 'string', required: true },
      { key: 'test_results', label: 'Test Results / Biomarkers', type: 'array', required: true },
      { key: 'abnormal_flags', label: 'Out of Range / Critical Flags', type: 'array' },
      { key: 'clinical_notes', label: 'Clinical Notes / Impression', type: 'string' }
    ],
    validationRules: [
      { rule: 'critical_values_flagged', description: 'Values outside normal reference range must trigger review flags' },
      { rule: 'test_date_not_future', description: 'Test date cannot be in the future' }
    ]
  },
  academic_transcript: {
    documentType: 'academic_transcript',
    category: 'Education',
    name: 'Academic Transcript / Report Card',
    fields: [
      { key: 'student_name', label: 'Student Name', type: 'string', required: true },
      { key: 'student_id', label: 'Student ID / Roll #', type: 'string' },
      { key: 'institution_name', label: 'Institution / University', type: 'string', required: true },
      { key: 'program_degree', label: 'Program / Degree', type: 'string', required: true },
      { key: 'graduation_date', label: 'Issue / Graduation Date', type: 'date' },
      { key: 'cumulative_gpa', label: 'Cumulative GPA / Grade', type: 'string', required: true },
      { key: 'total_credits_earned', label: 'Total Credits Earned', type: 'number' },
      { key: 'course_records', label: 'Course Records', type: 'array' }
    ],
    validationRules: [
      { rule: 'gpa_valid_range', description: 'GPA must conform to standard grading scale' },
      { rule: 'institution_verified', description: 'Issuing institution must be identifiable' }
    ]
  },
  receipt: {
    documentType: 'receipt',
    category: 'Finance/Accounting',
    name: 'Expense Receipt',
    fields: [
      { key: 'merchant_name', label: 'Merchant / Store', type: 'string', required: true },
      { key: 'transaction_date', label: 'Transaction Date', type: 'date', required: true },
      { key: 'payment_method', label: 'Payment Method (Card/Cash)', type: 'string' },
      { key: 'items', label: 'Purchased Items', type: 'array' },
      { key: 'tax_amount', label: 'Tax / VAT', type: 'number' },
      { key: 'tip_amount', label: 'Tip / Gratuity', type: 'number' },
      { key: 'total_amount', label: 'Total Paid', type: 'number', required: true },
      { key: 'currency', label: 'Currency', type: 'string', default: 'USD' }
    ],
    validationRules: [
      { rule: 'positive_total', description: 'Receipt total must be greater than zero' }
    ]
  },
  purchase_order: {
    documentType: 'purchase_order',
    category: 'Business/Operations',
    name: 'Purchase Order (PO)',
    fields: [
      { key: 'po_number', label: 'PO Number', type: 'string', required: true },
      { key: 'buyer_company', label: 'Buyer Organization', type: 'string', required: true },
      { key: 'supplier_name', label: 'Supplier / Vendor', type: 'string', required: true },
      { key: 'order_date', label: 'Order Date', type: 'date', required: true },
      { key: 'delivery_date', label: 'Expected Delivery Date', type: 'date' },
      { key: 'shipping_address', label: 'Shipping Address', type: 'string' },
      { key: 'total_amount', label: 'PO Total Amount', type: 'number', required: true },
      { key: 'line_items', label: 'Ordered Items', type: 'array' }
    ],
    validationRules: [
      { rule: 'po_total_matches_items', description: 'Sum of line items must match PO Total' }
    ]
  }
};

const PROFESSION_DEFAULTS = {
  'Finance/Accounting': {
    primarySchemas: ['invoice', 'receipt', 'purchase_order'],
    suggestedPrompts: [
      'What is the total sum across all uploaded invoices?',
      'List any tax discrepancies or line item calculation mismatches.',
      'Show all vendor payment terms that require payment within 15 days.',
      'Are there any duplicate invoices or duplicate amounts?'
    ],
    vocabulary: 'financial, accounts payable, tax compliance, ledger, audit trail'
  },
  'Legal': {
    primarySchemas: ['contract'],
    suggestedPrompts: [
      'Summarize key obligations and liabilities for both parties.',
      'What is the governing jurisdiction and termination notice period?',
      'Flag any non-standard indemnification or liability cap clauses.',
      'Are there any automatic renewal terms mentioned?'
    ],
    vocabulary: 'contractual, indemnification, jurisdiction, covenants, confidentiality'
  },
  'HR/Recruitment': {
    primarySchemas: ['resume'],
    suggestedPrompts: [
      'Compare the candidates by years of experience and top skills.',
      'Extract all candidates who have Python and Cloud architecture experience.',
      'Summarize candidate education history and certifications.',
      'Which candidate has the most relevant leadership experience?'
    ],
    vocabulary: 'talent acquisition, candidate qualifications, competencies, career trajectory'
  },
  'Healthcare': {
    primarySchemas: ['medical_report'],
    suggestedPrompts: [
      'Highlight all out-of-range or critical biomarker readings.',
      'Summarize the physician clinical notes and recommended follow-ups.',
      'Compare test dates and trend indications across reports.',
      'List all flagged abnormal metrics.'
    ],
    vocabulary: 'clinical, diagnostic, biomarkers, reference ranges, specimen'
  },
  'Education': {
    primarySchemas: ['academic_transcript'],
    suggestedPrompts: [
      'What is the cumulative GPA and total credits completed?',
      'List all courses where the grade was above 3.5 or A grade.',
      'Extract prerequisite course completions.',
      'Summarize degree conferral status.'
    ],
    vocabulary: 'academic, credits, semester, coursework, GPA, degree conferral'
  },
  'Business/Operations': {
    primarySchemas: ['purchase_order', 'invoice', 'contract'],
    suggestedPrompts: [
      'Match purchase orders with corresponding invoices.',
      'Show delivery date commitments and vendor SLAs.',
      'What is the total operational expenditure across all documents?',
      'Highlight any delivery delay risks or missing items.'
    ],
    vocabulary: 'supply chain, procurement, purchase orders, vendor relations, fulfillment'
  },
  'Real Estate': {
    primarySchemas: ['contract', 'receipt'],
    suggestedPrompts: [
      'Extract lease duration, monthly rent, and security deposit terms.',
      'Flag maintenance responsibilities and utility allocation.',
      'Summarize penalty clauses for early termination.',
      'Verify landlord and tenant signature details.'
    ],
    vocabulary: 'lease, tenancy, premises, escrow, title, square footage'
  },
  'Engineering': {
    primarySchemas: ['purchase_order', 'contract'],
    suggestedPrompts: [
      'Extract technical specifications and component part numbers.',
      'Summarize safety standards and warranty compliance.',
      'List all deliverable milestones and milestone dates.',
      'Highlight engineering tolerances or acceptance criteria.'
    ],
    vocabulary: 'specifications, schematics, compliance, tolerances, BOM, milestones'
  },
  'Other': {
    primarySchemas: ['invoice', 'contract', 'receipt', 'resume'],
    suggestedPrompts: [
      'Summarize all uploaded documents with key findings.',
      'Extract dates, amounts, and responsible parties.',
      'Flag any potential risks or inconsistencies across these files.',
      'Export a structured breakdown of all key values.'
    ],
    vocabulary: 'document processing, structured extraction, summary, key entities'
  }
};

module.exports = {
  SEED_SCHEMAS,
  PROFESSION_DEFAULTS
};
