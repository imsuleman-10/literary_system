import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecords, createRecord, updateRecord, deleteRecord } from '../api';
import toast from 'react-hot-toast';
import { 
  FiGrid, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiAward, 
  FiBriefcase, 
  FiStar, 
  FiUsers, 
  FiBookOpen, 
  FiUserCheck, 
  FiTool, 
  FiPlus, 
  FiSearch, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiDownload, 
  FiDollarSign,
  FiArrowUpRight,
  FiArrowDownRight,
  FiPieChart,
  FiShield,
  FiChevronLeft,
  FiSidebar
} from 'react-icons/fi';
import RecordModal from '../components/RecordModal';
import ConfirmModal from '../components/ConfirmModal';
import './Dashboard.css';

const ROLES_FILTER = [
  { id: 'all', label: 'All Roles', icon: FiGrid },
  { id: 'director', label: 'Directors', icon: FiAward },
  { id: 'head', label: 'Heads', icon: FiBriefcase },
  { id: 'core', label: 'Core Members', icon: FiStar },
  { id: 'general', label: 'General Members', icon: FiUsers },
  { id: 'student', label: 'Students', icon: FiBookOpen },
  { id: 'teacher', label: 'Faculty / Teachers', icon: FiUserCheck },
  { id: 'staff', label: 'Support Staff', icon: FiTool },
];

const ROLE_METADATA = {
  director: { label: 'Director', badgeClass: 'badge-director' },
  head:     { label: 'Head', badgeClass: 'badge-head' },
  core:     { label: 'Core Member', badgeClass: 'badge-core' },
  general:  { label: 'General Member', badgeClass: 'badge-general' },
  student:  { label: 'Student', badgeClass: 'badge-student' },
  teacher:  { label: 'Teacher', badgeClass: 'badge-teacher' },
  staff:    { label: 'Staff', badgeClass: 'badge-staff' },
};

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_state');
      if (saved !== null) return saved === 'true';
      return window.innerWidth > 1024;
    }
    return true;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_state', String(next));
      return next;
    });
  };

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (filterType !== 'all') params.type = filterType;
      if (search) params.search = search;
      const { data } = await getRecords(params);
      setRecords(data);
    } catch (err) {
      toast.error('Failed to retrieve records');
    } finally {
      setLoading(false);
    }
  }, [filterRole, filterType, search]);

  useEffect(() => {
    const timer = setTimeout(fetchRecords, 200);
    return () => clearTimeout(timer);
  }, [fetchRecords]);

  const handleSave = async (formData) => {
    try {
      if (editRecord) {
        await updateRecord(editRecord._id, formData);
        toast.success('Record updated successfully');
      } else {
        await createRecord(formData);
        toast.success('Transaction posted successfully');
      }
      setShowModal(false);
      setEditRecord(null);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction could not be saved');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecord(deleteId);
      toast.success('Record permanently removed');
      setDeleteId(null);
      fetchRecords();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    if (!records.length) {
      toast('No records to export', { icon: 'ℹ️' });
      return;
    }
    const headers = ['Name', 'Role', 'Nature', 'Amount (PKR)', 'Payment Method', 'Description', 'Date'];
    const rows = records.map(r => [
      `"${r.name}"`,
      `"${r.role}"`,
      `"${r.type}"`,
      r.amount,
      `"${r.paymentMethod || 'cash'}"`,
      `"${(r.description || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toISOString().split('T')[0]}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Ledger exported as CSV');
  };

  // Metrics Calculations
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    const roleCounts = {};

    records.forEach((r) => {
      const amt = Number(r.amount) || 0;
      if (r.type === 'expense') {
        expense += amt;
      } else {
        income += amt;
      }

      const roleKey = r.role || 'general';
      roleCounts[roleKey] = (roleCounts[roleKey] || 0) + 1;
    });

    const netBalance = income - expense;

    return {
      totalRecords: records.length,
      income,
      expense,
      netBalance,
      roleCounts,
    };
  }, [records]);

  const handleNavClick = (type, role = 'all') => {
    setFilterType(type);
    setFilterRole(role);
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="app-shell">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="drawer-backdrop" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true" 
        />
      )}

      {/* Industrial Standard Sidebar */}
      <aside className={`app-sidebar ${isSidebarOpen ? 'drawer-open' : 'sidebar-collapsed'}`}>
        {/* Brand Header Block - Clickable to collapse */}
        <div 
          className="sidebar-brand-block clickable" 
          onClick={toggleSidebar}
          title="Click to collapse sidebar"
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo-mark">
            <FiShield className="brand-shield-icon" />
          </div>
          <div className="brand-meta-group">
            <span className="brand-name">LEDGER PRO</span>
            <span className="brand-version">v2.4 Enterprise</span>
          </div>
          <button 
            type="button" 
            className="sidebar-dismiss-btn" 
            onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
            title="Collapse Sidebar"
            aria-label="Collapse sidebar"
          >
            <FiChevronLeft />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="sidebar-cta-wrap">
          <button
            type="button"
            className="sidebar-primary-btn"
            onClick={() => {
              setEditRecord(null);
              setShowModal(true);
              setIsSidebarOpen(false);
            }}
          >
            <FiPlus className="sidebar-plus-icon" />
            <span>New Transaction</span>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav-list" aria-label="Main Navigation">
          <div className="nav-group-caption">Financial Overview</div>

          <button
            type="button"
            className={`sidebar-nav-link ${filterType === 'all' && filterRole === 'all' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'all')}
          >
            <FiGrid className="nav-link-icon" />
            <span className="nav-link-label">All Transactions</span>
            <span className="nav-badge-count">{stats.totalRecords}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => handleNavClick('income', 'all')}
          >
            <FiTrendingUp className="nav-link-icon income-accent" />
            <span className="nav-link-label">Income & Fees</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => handleNavClick('expense', 'all')}
          >
            <FiTrendingDown className="nav-link-icon expense-accent" />
            <span className="nav-link-label">Expenses & Salaries</span>
          </button>

          <div className="nav-group-caption">Categorized Directories</div>

          <button
            type="button"
            className={`sidebar-nav-link ${filterRole === 'director' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'director')}
          >
            <FiAward className="nav-link-icon" />
            <span className="nav-link-label">Directors</span>
            <span className="nav-badge-count">{stats.roleCounts['director'] || 0}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterRole === 'head' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'head')}
          >
            <FiBriefcase className="nav-link-icon" />
            <span className="nav-link-label">Heads</span>
            <span className="nav-badge-count">{stats.roleCounts['head'] || 0}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterRole === 'core' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'core')}
          >
            <FiStar className="nav-link-icon" />
            <span className="nav-link-label">Core Members</span>
            <span className="nav-badge-count">{stats.roleCounts['core'] || 0}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterRole === 'general' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'general')}
          >
            <FiUsers className="nav-link-icon" />
            <span className="nav-link-label">General Members</span>
            <span className="nav-badge-count">{stats.roleCounts['general'] || 0}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterRole === 'student' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'student')}
          >
            <FiBookOpen className="nav-link-icon" />
            <span className="nav-link-label">Students</span>
            <span className="nav-badge-count">{stats.roleCounts['student'] || 0}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterRole === 'teacher' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'teacher')}
          >
            <FiUserCheck className="nav-link-icon" />
            <span className="nav-link-label">Faculty / Teachers</span>
            <span className="nav-badge-count">{stats.roleCounts['teacher'] || 0}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-link ${filterRole === 'staff' ? 'active' : ''}`}
            onClick={() => handleNavClick('all', 'staff')}
          >
            <FiTool className="nav-link-icon" />
            <span className="nav-link-label">Support Staff</span>
            <span className="nav-badge-count">{stats.roleCounts['staff'] || 0}</span>
          </button>
        </nav>

        {/* Sidebar Footer with Net Position & Auth Profile */}
        <div className="sidebar-footer-region">
          <div className={`net-position-box ${stats.netBalance >= 0 ? 'surplus' : 'deficit'}`}>
            <div className="position-meta-row">
              <span className="position-caption">NET REVENUE</span>
              <span className="position-status-pill">
                {stats.netBalance >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
            <div className="position-numeric">
              {stats.netBalance < 0 && '- '}PKR {Math.abs(stats.netBalance).toLocaleString()}
            </div>
          </div>

          <div className="sidebar-profile-card">
            <div className="profile-glyph">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="profile-text-wrap">
              <span className="profile-display-name">{admin?.name || 'Administrator'}</span>
              <span className="profile-mail-text">{admin?.email}</span>
            </div>
            <button
              type="button"
              className="profile-logout-button"
              onClick={logout}
              title="Terminate Session"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <div className={`app-workspace ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        {/* Top Navbar */}
        <header className="workspace-header">
          <div 
            className="header-left-cluster clickable" 
            onClick={toggleSidebar}
            title={isSidebarOpen ? "Click to collapse sidebar" : "Click to expand sidebar"}
            role="button"
            tabIndex={0}
          >
            <button
              type="button"
              className="drawer-toggle-btn"
              onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-label="Toggle sidebar"
            >
              <FiSidebar />
            </button>
            <div className="header-breadcrumbs">
              <span className="breadcrumb-root">Ledger</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">
                {filterType === 'all' ? 'All Transactions' : filterType === 'income' ? 'Income Stream' : 'Expenditure Stream'}
              </span>
              {filterRole !== 'all' && (
                <span className="filter-active-tag">{filterRole.toUpperCase()}</span>
              )}
            </div>
          </div>

          <div className="header-right-cluster">
            <button
              type="button"
              className="header-secondary-btn"
              onClick={handleExportCSV}
              title="Export as CSV spreadsheet"
            >
              <FiDownload />
              <span className="btn-label-responsive">Export CSV</span>
            </button>
            <button
              type="button"
              className="header-primary-btn"
              onClick={() => {
                setEditRecord(null);
                setShowModal(true);
              }}
            >
              <FiPlus />
              <span>Record Entry</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="workspace-content">
          {/* Executive Stat Cards */}
          <section className="executive-metrics-grid">
            <div className={`stat-metric-card net-balance-metric ${stats.netBalance >= 0 ? 'surplus' : 'deficit'}`}>
              <div className="stat-metric-header">
                <span className="stat-metric-label">Net Balance (Surplus/Deficit)</span>
                {stats.netBalance >= 0 ? (
                  <span className="stat-trend-indicator positive">
                    <FiArrowUpRight /> In Budget
                  </span>
                ) : (
                  <span className="stat-trend-indicator negative">
                    <FiArrowDownRight /> Negative
                  </span>
                )}
              </div>
              <div className="stat-metric-value">
                {stats.netBalance < 0 && '- '}PKR {Math.abs(stats.netBalance).toLocaleString()}
              </div>
              <div className="stat-metric-footnote">
                Calculated as Net Total of Incomes minus Expenditures
              </div>
            </div>

            <div className="stat-metric-card">
              <div className="stat-metric-header">
                <span className="stat-metric-label">Gross Revenue (Inflow)</span>
                <span className="stat-metric-icon-badge income">
                  <FiTrendingUp />
                </span>
              </div>
              <div className="stat-metric-value income-highlight">
                + PKR {stats.income.toLocaleString()}
              </div>
              <div className="stat-metric-footnote">
                Collected fees, payments, and contributions
              </div>
            </div>

            <div className="stat-metric-card">
              <div className="stat-metric-header">
                <span className="stat-metric-label">Operating Expenses (Outflow)</span>
                <span className="stat-metric-icon-badge expense">
                  <FiTrendingDown />
                </span>
              </div>
              <div className="stat-metric-value expense-highlight">
                - PKR {stats.expense.toLocaleString()}
              </div>
              <div className="stat-metric-footnote">
                Salaries, supplies, and maintenance deductions
              </div>
            </div>

            <div className="stat-metric-card">
              <div className="stat-metric-header">
                <span className="stat-metric-label">Registered Entries</span>
                <span className="stat-metric-icon-badge neutral">
                  <FiPieChart />
                </span>
              </div>
              <div className="stat-metric-value">
                {stats.totalRecords}
              </div>
              <div className="stat-metric-footnote">
                Across 7 distinct organizational roles
              </div>
            </div>
          </section>

          {/* Search & Filter Toolbar */}
          <section className="data-toolbar-card">
            <div className="search-input-group">
              <FiSearch className="search-leading-glyph" />
              <input
                type="text"
                placeholder="Search ledger by individual or party name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-glyph"
                  onClick={() => setSearch('')}
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="role-filter-row">
              {ROLES_FILTER.map((rf) => {
                const IconComp = rf.icon;
                const isSelected = filterRole === rf.id;
                return (
                  <button
                    key={rf.id}
                    type="button"
                    className={`role-filter-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => setFilterRole(rf.id)}
                  >
                    <IconComp className="chip-glyph" />
                    <span>{rf.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Data Table & Mobile List View */}
          <section className="data-display-section">
            {loading ? (
              <div className="data-status-card">
                <div className="data-loading-ring" />
                <p>Loading database entries...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="data-status-card empty-state">
                <div className="empty-symbol-circle">
                  <FiGrid />
                </div>
                <h3>No transaction entries located</h3>
                <p>There are no recorded transactions matching your active filter configuration.</p>
                <button
                  type="button"
                  className="empty-cta-button"
                  onClick={() => {
                    setEditRecord(null);
                    setShowModal(true);
                  }}
                >
                  <FiPlus />
                  <span>Create First Transaction</span>
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Responsive Table */}
                <div className="enterprise-table-wrapper">
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th className="th-index">#</th>
                        <th>Individual / Entity</th>
                        <th>Role / Designation</th>
                        <th>Nature</th>
                        <th className="th-number">Settlement Amount</th>
                        <th>Channel</th>
                        <th>Reference / Description</th>
                        <th>Posted Date</th>
                        <th className="th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((rec, index) => {
                        const roleMeta = ROLE_METADATA[rec.role] || ROLE_METADATA.general;
                        const isExpense = rec.type === 'expense';
                        return (
                          <tr key={rec._id} className="table-data-row">
                            <td className="td-index">{index + 1}</td>
                            <td>
                              <div className="entity-cell-wrap">
                                <div className="entity-avatar-initial">
                                  {rec.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="entity-text-details">
                                  <span className="entity-primary-name">{rec.name}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`designation-tag ${roleMeta.badgeClass}`}>
                                {roleMeta.label}
                              </span>
                            </td>
                            <td>
                              <span className={`transaction-nature-chip ${isExpense ? 'debit' : 'credit'}`}>
                                {isExpense ? 'Debit (Outflow)' : 'Credit (Inflow)'}
                              </span>
                            </td>
                            <td className="td-number">
                              <span className={`numeric-amount-display ${isExpense ? 'negative-val' : 'positive-val'}`}>
                                {isExpense ? '- ' : '+ '}PKR {Number(rec.amount).toLocaleString()}
                              </span>
                            </td>
                            <td>
                              <span className="settlement-channel-tag">
                                {rec.paymentMethod === 'online' ? 'Digital Wallet' : rec.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash'}
                              </span>
                            </td>
                            <td className="td-description-cell">
                              <span className="description-text" title={rec.description}>
                                {rec.description || <span className="null-symbol">—</span>}
                              </span>
                            </td>
                            <td className="td-date-cell">
                              {new Date(rec.createdAt).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="td-actions">
                              <div className="action-button-cluster">
                                <button
                                  type="button"
                                  className="action-button edit-action"
                                  onClick={() => { setEditRecord(rec); setShowModal(true); }}
                                  title="Edit entry"
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  type="button"
                                  className="action-button delete-action"
                                  onClick={() => setDeleteId(rec._id)}
                                  title="Delete entry"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="mobile-ledger-grid">
                  {records.map((rec) => {
                    const roleMeta = ROLE_METADATA[rec.role] || ROLE_METADATA.general;
                    const isExpense = rec.type === 'expense';
                    return (
                      <div key={rec._id} className={`mobile-ledger-card ${isExpense ? 'expense-indicator' : 'income-indicator'}`}>
                        <div className="mobile-card-top-row">
                          <div className="mobile-entity-block">
                            <div className="entity-avatar-initial">
                              {rec.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="mobile-entity-name">{rec.name}</h4>
                              <span className="mobile-posted-date">
                                {new Date(rec.createdAt).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                          <span className={`designation-tag ${roleMeta.badgeClass}`}>
                            {roleMeta.label}
                          </span>
                        </div>

                        <div className="mobile-card-financial-box">
                          <div className="financial-meta-row">
                            <span className="financial-label">
                              {isExpense ? 'Debited Expense' : 'Credited Income'}
                            </span>
                            <span className="settlement-channel-tag">
                              {rec.paymentMethod === 'online' ? 'Digital' : rec.paymentMethod === 'bank' ? 'Bank' : 'Cash'}
                            </span>
                          </div>
                          <div className={`mobile-amount-headline ${isExpense ? 'negative-val' : 'positive-val'}`}>
                            {isExpense ? '- ' : '+ '}PKR {Number(rec.amount).toLocaleString()}
                          </div>
                          {rec.description && (
                            <p className="mobile-memo-text">{rec.description}</p>
                          )}
                        </div>

                        <div className="mobile-card-action-bar">
                          <button
                            type="button"
                            className="mobile-action-button edit"
                            onClick={() => { setEditRecord(rec); setShowModal(true); }}
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button
                            type="button"
                            className="mobile-action-button delete"
                            onClick={() => setDeleteId(rec._id)}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {/* Modals */}
      {showModal && (
        <RecordModal
          record={editRecord}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditRecord(null); }}
        />
      )}

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this transaction record? This action will adjust the financial ledger balances and cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
