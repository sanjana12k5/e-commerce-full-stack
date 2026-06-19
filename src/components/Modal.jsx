import { X } from 'lucide-react';

export default function Modal({ show, onClose, title, children, onSubmit, submitLabel = 'Save' }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            {children}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
