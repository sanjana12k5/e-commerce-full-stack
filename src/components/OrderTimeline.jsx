import { CheckCircle2 } from 'lucide-react';

export default function OrderTimeline({ status }) {
  const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentIdx = steps.indexOf(status);

  const labels = {
    pending: { label: 'Pending', desc: 'Order placed & awaiting verification' },
    confirmed: { label: 'Confirmed', desc: 'Verified by inventory manager' },
    shipped: { label: 'Shipped', desc: 'Package handed to courier' },
    delivered: { label: 'Delivered', desc: 'Package received by recipient' },
  };

  return (
    <div className="tracking-timeline">
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const isActive = idx === currentIdx + 1;
        const showLine = idx < steps.length - 1;

        return (
          <span key={step} style={{ display: 'contents' }}>
            <div className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="timeline-node">
                {isCompleted ? <CheckCircle2 className="icon-check" /> : <div className="timeline-dot"></div>}
              </div>
              <div className="timeline-info">
                <span className="step-label">{labels[step].label}</span>
                <span className="step-desc">{labels[step].desc}</span>
              </div>
            </div>

            {showLine && (
              <div className={`timeline-line ${idx < currentIdx ? 'completed' : ''}`}></div>
            )}
          </span>
        );
      })}
    </div>
  );
}
