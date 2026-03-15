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
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-pulse"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-[220px] bg-[#5b5f97] text-white flex flex-col fixed h-screen left-0 top-0 z-[100] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-5 text-center mx-2.5">
          <div className="w-[100px] h-[100px] mx-auto rounded-full bg-white flex items-center justify-center">
            <img src={kkfiLogo} alt="KKFI Logo" className="w-[90px] h-[90px] rounded-full object-cover" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/30 my-2.5 mx-5 mb-5" />

        {/* Navigation */}
        <nav className="flex-1 p-0 overflow-y-auto">
          {sections ? (
            sections.map((section) => (
              <div key={section.title} className="mb-2.5">
                <div className="text-[11px] uppercase text-white/50 pt-2.5 px-5 pb-1.5 tracking-[1px]">
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
        <div className="p-5 border-t border-white/10">
          <button
            onClick={footer.onClick}
            className="flex items-center gap-3 text-white/70 bg-transparent border-none text-sm cursor-pointer p-0 w-full hover:text-white transition-colors"
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
      className={`flex items-center gap-3 py-3 px-5 text-sm no-underline transition-all duration-200 border-l-[3px] ${isActive ? 'text-white border-white bg-white/15' : 'text-white/85 border-transparent bg-transparent hover:bg-white/5 hover:text-white'}`}
    >
      {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
      {item.label}
    </a>
  );
};

export default Sidebar;
