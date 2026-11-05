import { FiAlertTriangle } from 'react-icons/fi';
import './ConfirmModal.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-box">
          <FiAlertTriangle className="confirm-warning-icon" />
        </div>
        <h3 className="confirm-heading">Delete Confirmation</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions-row">
          <button type="button" className="confirm-cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="confirm-delete-button" onClick={onConfirm}>
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
