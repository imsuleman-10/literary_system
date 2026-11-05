import { useState, useEffect } from 'react';
import { 
  FiX, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUser, 
  FiDollarSign, 
  FiCreditCard, 
  FiSmartphone, 
  FiBriefcase, 
  FiFileText,
  FiCheck
} from 'react-icons/fi';
import './RecordModal.css';

const ROLES_LIST = [
  { id: 'director', label: 'Director', group: 'Executive' },
  { id: 'head', label: 'Head', group: 'Executive' },
  { id: 'core', label: 'Core Member', group: 'Leadership' },
  { id: 'general', label: 'General Member', group: 'Team' },
  { id: 'student', label: 'Student', group: 'Academic' },
  { id: 'teacher', label: 'Faculty / Teacher', group: 'Academic' },
  { id: 'staff', label: 'Support Staff', group: 'Operations' },
];

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: FiDollarSign },
  { id: 'online', label: 'Digital / Wallet', icon: FiSmartphone },
  { id: 'bank', label: 'Bank Transfer', icon: FiCreditCard },
];

const RecordModal = ({ record, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    type: 'income', // 'income' or 'expense'
    role: 'general',
    paymentMethod: 'cash',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setForm({
        name: record.name || '',
        amount: record.amount || '',
        type: record.type || 'income',
        role: record.role || 'general',
        paymentMethod: record.paymentMethod || 'cash',
        description: record.description || '',
      });
    }
  }, [record]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.amount === '') return;
    setLoading(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        amount: Number(form.amount),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <h2 className="modal-title">
              {record ? 'Edit Transaction Record' : 'Record New Transaction'}
            </h2>
            <p className="modal-subtitle">
              Configure accounting entry details, designation, and payment channel
            </p>
          </div>
          <button 
            type="button" 
            className="modal-close-trigger" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Nature Toggle */}
          <div className="form-field-group">
            <label className="field-label-text">Transaction Nature</label>
            <div className="nature-selector-grid">
              <button
                type="button"
                className={`nature-option-btn income ${form.type === 'income' ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, type: 'income' })}
              >
                <div className="nature-icon-box">
                  <FiTrendingUp />
                </div>
                <div className="nature-meta">
                  <span className="nature-title">Income / Credit</span>
                  <span className="nature-sub">Add funds to balance (+)</span>
                </div>
                {form.type === 'income' && <FiCheck className="nature-check" />}
              </button>

              <button
                type="button"
                className={`nature-option-btn expense ${form.type === 'expense' ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, type: 'expense' })}
              >
                <div className="nature-icon-box">
                  <FiTrendingDown />
                </div>
                <div className="nature-meta">
                  <span className="nature-title">Expense / Debit</span>
                  <span className="nature-sub">Deduct funds from balance (-)</span>
                </div>
                {form.type === 'expense' && <FiCheck className="nature-check" />}
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-field-group">
            <label htmlFor="record-name" className="field-label-text">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="field-input-box">
              <FiUser className="field-adornment-icon" />
              <input
                id="record-name"
                type="text"
                placeholder="e.g. Suleman Zaheer"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Amount & Role Grid */}
          <div className="form-two-column-grid">
            <div className="form-field-group">
              <label htmlFor="record-amount" className="field-label-text">
                Amount (PKR) <span className="required-star">*</span>
              </label>
              <div className="field-input-box amount-box">
                <span className="currency-prefix">
                  {form.type === 'expense' ? '- Rs.' : '+ Rs.'}
                </span>
                <input
                  id="record-amount"
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="record-role" className="field-label-text">
                Role / Designation <span className="required-star">*</span>
              </label>
              <div className="field-input-box">
                <FiBriefcase className="field-adornment-icon" />
                <select
                  id="record-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  className="field-select-element"
                >
                  <optgroup label="Executive Leadership">
                    <option value="director">Director</option>
                    <option value="head">Head</option>
                  </optgroup>
                  <optgroup label="Organization Members">
                    <option value="core">Core Member</option>
                    <option value="general">General Member</option>
                  </optgroup>
                  <optgroup label="Academic & Operations">
                    <option value="student">Student</option>
                    <option value="teacher">Faculty / Teacher</option>
                    <option value="staff">Support Staff</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="form-field-group">
            <label className="field-label-text">Settlement Channel</label>
            <div className="payment-pills-row">
              {PAYMENT_METHODS.map((pm) => {
                const IconComponent = pm.icon;
                const isSelected = form.paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    className={`payment-pill-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, paymentMethod: pm.id })}
                  >
                    <IconComponent className="payment-pill-icon" />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="form-field-group">
            <label htmlFor="record-desc" className="field-label-text">
              Notes / Description (Optional)
            </label>
            <div className="field-textarea-box">
              <FiFileText className="textarea-adornment-icon" />
              <textarea
                id="record-desc"
                rows={2}
                placeholder="Reference details, transaction ID, purpose..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="modal-footer-actions">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`modal-confirm-btn ${form.type === 'expense' ? 'expense-action' : 'income-action'}`}
              disabled={loading}
            >
              {loading ? (
                <span className="modal-btn-spinner" />
              ) : (
                <span>
                  {record ? 'Save Changes' : form.type === 'expense' ? 'Post Expense (-)' : 'Post Income (+)'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordModal;
