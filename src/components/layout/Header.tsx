'use client';

import React from 'react';
import {
  Barcode,
  ChevronDown,
  Database,
  Download,
  Menu,
  MoreHorizontal,
  Plus,
  ScanLine,
  Search,
  Smartphone,
  Upload,
  UserCircle2,
  type LucideIcon,
} from 'lucide-react';
import { AccustandardLogo } from '@/components/brand/AccustandardLogo';
import {
  canUseOperation,
  getAllowedTabs,
  normalizeRole,
  ROLE_OPTIONS,
  type Role,
} from '@/lib/permissions';

interface HeaderProps {
  activeTab: string;
  viewAsRole: Role;
  onSelectTab: (tabKey: string) => void;
  onChangeRole: (role: Role) => void;
  onOpenCommandPalette: () => void;
  onOpenCreateNew: () => void;
  onOpenScanner: () => void;
  onOpenPWAInstall: () => void;
  onOpenMobileDrawer: () => void;
  onOpenExport: () => void;
  onOpenStartupImport: () => void;
  onOpenQBOQueue: () => void;
  onOpenProductManager: () => void;
  qboQueueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  viewAsRole,
  onSelectTab,
  onChangeRole,
  onOpenCommandPalette,
  onOpenCreateNew,
  onOpenScanner,
  onOpenPWAInstall,
  onOpenMobileDrawer,
  onOpenExport,
  onOpenStartupImport,
  onOpenQBOQueue,
  onOpenProductManager,
  qboQueueCount,
}) => {
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const toolsButtonRef = React.useRef<HTMLButtonElement>(null);
  const toolsMenuRef = React.useRef<HTMLDivElement>(null);
  const menuItemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const allowed = getAllowedTabs(viewAsRole);
  const canOpenAdmin = canUseOperation(viewAsRole, 'admin');
  const operationsMenuId = 'operations-menu';
  const operationsButtonId = 'operations-menu-button';
  const operationItems: Array<{ id: string; label: string; visible: boolean; icon: LucideIcon; onSelect: () => void }> = [
    { id: 'create-new', label: 'Create new', visible: canUseOperation(viewAsRole, 'create'), icon: Plus, onSelect: onOpenCreateNew },
    { id: 'export-report', label: 'Export report', visible: canUseOperation(viewAsRole, 'export'), icon: Download, onSelect: onOpenExport },
    { id: 'startup-import', label: 'Startup import', visible: canUseOperation(viewAsRole, 'import') && canOpenAdmin, icon: Upload, onSelect: onOpenStartupImport },
    { id: 'qbo-sync', label: 'QBO sync queue', visible: canUseOperation(viewAsRole, 'qbo'), icon: Database, onSelect: onOpenQBOQueue },
    { id: 'barcode-manager', label: 'Barcode manager', visible: canUseOperation(viewAsRole, 'barcode'), icon: Barcode, onSelect: onOpenProductManager },
    { id: 'barcode-scanner', label: 'Barcode scanner', visible: canUseOperation(viewAsRole, 'scanner'), icon: ScanLine, onSelect: onOpenScanner },
    { id: 'install-app', label: 'Install app', visible: canUseOperation(viewAsRole, 'pwa'), icon: Smartphone, onSelect: onOpenPWAInstall },
  ].filter((item) => item.visible);

  const closeToolsMenu = React.useCallback((restoreFocus = true) => {
    setIsToolsOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => toolsButtonRef.current?.focus());
  }, []);

  const focusMenuItem = (index: number) => {
    const nextIndex = (index + operationItems.length) % operationItems.length;
    menuItemRefs.current[nextIndex]?.focus();
  };

  const openToolsMenu = (index = 0) => {
    if (!operationItems.length) return;
    setIsToolsOpen(true);
    window.requestAnimationFrame(() => menuItemRefs.current[index]?.focus());
  };

  React.useEffect(() => {
    if (!isToolsOpen) return undefined;

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!toolsMenuRef.current?.contains(target) && !toolsButtonRef.current?.contains(target)) {
        closeToolsMenu(false);
      }
    };
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeToolsMenu();
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointer);
    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [closeToolsMenu, isToolsOpen]);

  const handleMenuButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape' && isToolsOpen) {
      event.preventDefault();
      closeToolsMenu();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isToolsOpen) closeToolsMenu();
      else openToolsMenu(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (isToolsOpen) closeToolsMenu();
      else openToolsMenu(operationItems.length - 1);
    }
  };

  const handleMenuItemKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusMenuItem(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusMenuItem(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusMenuItem(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusMenuItem(operationItems.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeToolsMenu();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };
  const ordersTarget = allowed.includes('quotations') ? 'quotations' : 'purchasing';
  const financeTarget = allowed.includes('soa') ? 'soa' : 'rfp';
  const navigation = [
    { label: 'Dashboard', key: 'overview', target: 'overview', visible: allowed.includes('overview') },
    { label: 'Inventory', key: 'inventory', target: 'inventory', visible: allowed.includes('inventory') },
    { label: 'Orders', key: 'orders', target: ordersTarget, visible: allowed.includes('quotations') || allowed.includes('purchasing') },
    { label: 'Finance', key: 'finance', target: financeTarget, visible: allowed.includes('soa') || allowed.includes('rfp') },
    { label: 'Reports', key: 'reports', target: 'admin', visible: allowed.includes('admin') && canOpenAdmin },
  ].filter((item) => item.visible);

  const isActive = (key: string, target: string) => {
    if (key === 'orders') return ['quotations', 'purchasing'].includes(activeTab);
    if (key === 'finance') return ['soa', 'rfp'].includes(activeTab);
    return activeTab === target;
  };

  return (
    <header
      role="banner"
      className="wayfinding-header sticky top-0 z-[var(--z-header)] w-full pt-[env(safe-area-inset-top,0px)] text-slate-950"
    >
      <div className="header-inner mx-auto flex min-h-[72px] w-full items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex min-w-0 shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="header-icon-button inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg min-[1280px]:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <AccustandardLogo size="md" className="max-w-[154px] shrink-0 sm:max-w-[190px]" />
        </div>

        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center gap-4 min-[1280px]:flex xl:gap-6">
          {navigation.map((item) => {
            const active = isActive(item.key, item.target);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectTab(item.target)}
                className="header-nav-link px-2.5"
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="header-search hidden h-10 w-[250px] items-center justify-between rounded-md px-3.5 text-left text-sm shadow-none min-[1536px]:flex"
            aria-label="Quick search"
          >
            <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Quick search</span>
            <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500">⌘K</kbd>
          </button>

          <div className="role-switcher hidden min-h-[44px] items-center gap-1 rounded-lg px-3 sm:flex">
            <select
              aria-label="Demo role simulation"
              value={viewAsRole}
              onChange={(event) => onChangeRole(normalizeRole(event.target.value))}
              className="max-w-[132px] bg-transparent text-sm font-medium outline-none sm:max-w-[170px]"
            >
              {ROLE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value} className="bg-white text-slate-900">{label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-500" />
          </div>

          <span role="img" className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-700 sm:inline-flex" aria-label="Current user">
            <UserCircle2 className="h-8 w-8" />
          </span>

          {canUseOperation(viewAsRole, 'qbo') && (
            <button
              type="button"
              onClick={onOpenQBOQueue}
              className="header-icon-button relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg"
              aria-label={`Open QBO sync queue${qboQueueCount ? ` (${qboQueueCount} pending)` : ''}`}
            >
              <Database className="h-5 w-5" />
              {qboQueueCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--brand-red)] ring-2 ring-white" />}
            </button>
          )}

          {operationItems.length > 0 && <div className="relative hidden min-[1280px]:block">
            <button
              ref={toolsButtonRef}
              type="button"
              id={operationsButtonId}
              onClick={() => { if (isToolsOpen) closeToolsMenu(); else openToolsMenu(); }}
              onKeyDown={handleMenuButtonKeyDown}
              aria-expanded={isToolsOpen}
              aria-haspopup="menu"
              aria-controls={operationsMenuId}
              aria-label="Open more tools"
              className="header-icon-button inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-3"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>More tools</span>
            </button>
            {isToolsOpen && (
              <div id={operationsMenuId} ref={toolsMenuRef} role="menu" aria-labelledby={operationsButtonId} className="wayfinding-card absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 p-2 shadow-xl">
                <div role="presentation" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Operations &amp; tools</div>
                {operationItems.map(({ id, label, icon: Icon, onSelect }, index) => (
                  <button
                    key={id}
                    ref={(element) => { menuItemRefs.current[index] = element; }}
                    type="button"
                    role="menuitem"
                    tabIndex={index === 0 ? 0 : -1}
                    onClick={() => { onSelect(); closeToolsMenu(); }}
                    onKeyDown={(event) => handleMenuItemKeyDown(event, index)}
                    className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    <Icon className="h-4 w-4 text-blue-700" />
                    {label}
                    {id === 'qbo-sync' && qboQueueCount > 0 && <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">{qboQueueCount}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>}

          <button type="button" onClick={onOpenCommandPalette} className="header-icon-button inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg min-[1536px]:hidden" aria-label="Quick search"><Search className="h-5 w-5" /></button>
          {canUseOperation(viewAsRole, 'pwa') && <button type="button" onClick={onOpenPWAInstall} className="header-icon-button hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg sm:inline-flex min-[1280px]:hidden" aria-label="Install app"><Smartphone className="h-5 w-5" /></button>}
        </div>
      </div>
    </header>
  );
};
