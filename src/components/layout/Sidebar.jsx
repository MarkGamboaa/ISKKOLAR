import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kkfiLogo from "../../assets/KKFI LOGO.png";

const Sidebar = ({ items, sections, isOpen, onClose, footerAction }) => {
  const { logout } = useAuth();

  const defaultFooterAction = {
    label: "Logout",
    onClick: () => {
      logout();
      onClose?.();
    },
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
    ),
  };

  const footer = footerAction
    ? {
        ...footerAction,
        onClick: () => {
          footerAction.onClick?.();
          onClose?.();
        },
      }
    : defaultFooterAction;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: '#5b5f97',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
        className={`
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div style={{ padding: 20, textAlign: 'center', margin: '0 10px' }}>
          <div style={{
            width: 100, height: 100, margin: '0 auto', borderRadius: '50%',
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={kkfiLogo} alt="KKFI Logo" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.3)', margin: '10px 20px 20px' }} />

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0', overflowY: 'auto' }}>
          {sections ? (
            sections.map((section) => (
              <div key={section.title} style={{ marginBottom: 10 }}>
                <div style={{
                  fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                  padding: '10px 20px 5px', letterSpacing: 1,
                }}>
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <SidebarLink key={item.label} item={item} onClose={onClose} />
                ))}
              </div>
            ))
          ) : (
            items?.map((item) => (
              <SidebarLink key={item.label} item={item} onClose={onClose} />
            ))
          )}
        </nav>

        {/* Footer */}
        <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={footer.onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none',
              fontSize: 14, cursor: 'pointer', padding: 0, width: '100%',
            }}
          >
            {footer.icon}
            {footer.label}
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ item, onClose }) => {
  const isActive = item.active;

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        item.onClick?.();
        onClose?.();
      }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 20px',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
        textDecoration: 'none', fontSize: 14,
        transition: 'all 0.2s ease',
        borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
        background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
      }}
    >
      {item.icon && <span style={{ width: 20, height: 20, flexShrink: 0 }}>{item.icon}</span>}
      {item.label}
    </a>
  );
};

export default Sidebar;
