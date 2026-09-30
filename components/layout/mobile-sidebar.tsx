"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { setSidebarOpen } from "@/lib/store/ui-slice";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function MobileSidebar() {
  const open = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(setSidebarOpen(false));
  }, [pathname, dispatch]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      inert={open ? undefined : true}
      aria-hidden={!open}
      className={open ? "md:hidden" : "pointer-events-none md:hidden"}
    >
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => dispatch(setSidebarOpen(false))}
      />
      <Sidebar
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      />
    </div>,
    document.body,
  );
}

export { MobileSidebar };
