import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';

export default function StatsGrid({ stats }) {
  const cards = [
    { label: 'Total Revenue', value: `$${stats.revenue}`, Icon: DollarSign, bg: undefined, color: undefined },
    { label: 'Total Orders', value: stats.orders, Icon: Package, bg: '#fee2e2', color: '#dc2626' },
    { label: 'Catalog Items', value: stats.catalog, Icon: TrendingUp, bg: '#e0f2fe', color: '#0284c7' },
    { label: 'Active Profiles', value: stats.users, Icon: Users, bg: '#fef3c7', color: '#d97706' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stat-card" key={card.label}>
          <div
            className="stat-icon-wrapper"
            style={card.bg ? { backgroundColor: card.bg, color: card.color } : undefined}
          >
            <card.Icon className="icon" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{card.label}</span>
            <span className="stat-val">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
