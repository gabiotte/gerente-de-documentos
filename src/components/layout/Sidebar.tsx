import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Settings,
  HelpCircle,
} from 'lucide-react';

const menuItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/documents',
    label: 'Documentos',
    icon: FileText,
  },
  {
    path: '/approvals',
    label: 'Aprovações',
    icon: CheckSquare,
  },
];

const bottomMenuItems = [
  {
    path: '/settings',
    label: 'Configurações',
    icon: Settings,
  },
  {
    path: '/help',
    label: 'Ajuda',
    icon: HelpCircle,
  },
];

export function Sidebar() {
  return (
    <aside className="bg-slate-900 w-64 min-h-screen fixed left-0 top-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">HR Docs</h2>
            <p className="text-slate-400 text-xs">Sistema de RH</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
        <nav className="space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
