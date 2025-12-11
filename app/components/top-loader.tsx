"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept all link clicks to show loading bar
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.href && !anchor.target) {
        const currentUrl = window.location.href;
        const targetUrl = anchor.href;
        
        // Only show loading bar if navigating to a different page
        if (targetUrl !== currentUrl && !targetUrl.includes("#")) {
          NProgress.start();
        }
      }
    };

    // Intercept form submissions
    const handleFormSubmit = () => {
      NProgress.start();
    };

    // Add event listeners
    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, []);

  return null;
}
