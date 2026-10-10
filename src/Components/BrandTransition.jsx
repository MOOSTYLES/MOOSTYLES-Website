import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { getSiteIdentity } from "@/lib/siteIdentity";
import { ARDENNE_PUBLIC_COPY, ARDENNE_LOGOS } from "@/content/ardenne";

const EASE = [0.76, 0, 0.24, 1];

export const BrandTransition = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const reduceMotion = useReducedMotion();
  const [transition, setTransition] = useState(null);
  const revealTimer = useRef(null);
  const previousLocationKey = useRef(location.key);
  const transitionCount = useRef(0);
  const focusDestination = useRef(false);
  const transitioning = Boolean(transition);
  const revealing = transition?.phase === "reveal";

  useEffect(() => () => window.clearTimeout(revealTimer.current), []);

  useEffect(() => {
    if (!transitioning) return undefined;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const cancelForHistory = () => {
      window.clearTimeout(revealTimer.current);
      focusDestination.current = false;
      setTransition(null);
    };
    window.addEventListener("popstate", cancelForHistory);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("popstate", cancelForHistory);
    };
  }, [transitioning]);

  useEffect(() => {
    const changed = previousLocationKey.current !== location.key;
    previousLocationKey.current = location.key;
    if (!changed || !transition) return;
    if (transition.phase === "navigating" && navigationType === "PUSH" && location.state?.brandTransitionId === transition.id) {
      setTransition((current) => ({ ...current, phase: "hold" }));
      revealTimer.current = window.setTimeout(() => {
        setTransition((current) => current ? { ...current, phase: "reveal" } : null);
      }, 180);
    } else {
      window.clearTimeout(revealTimer.current);
      focusDestination.current = true;
      setTransition(null);
    }
  }, [location.key, location.state, navigationType, transition]);

  useEffect(() => {
    if (transitioning || !focusDestination.current) return;
    focusDestination.current = false;
    const main = document.querySelector("#main-content, main");
    if (main) {
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }, [transitioning, location.key]);

  const handleClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const control = event.target.closest?.("button, input, select, textarea, [role='button']");
    if (control && control !== link) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === "/redirector" || url.pathname.startsWith("/api/")) return;
    const destination = getSiteIdentity(url.pathname);
    if (destination === getSiteIdentity(location.pathname)) return;

    // Capture every ordinary internal brand crossing, including menu and footer links.
    event.preventDefault();
    event.stopPropagation();
    if (transition) return;
    const to = `${url.pathname}${url.search}${url.hash}`;
    const state = { catalogWordmarkFrom: destination === "ardenne" ? "ARDENNE" : "MOOSTYLES" };
    if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      focusDestination.current = true;
      navigate(to, { state });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    const id = `${location.key}-${++transitionCount.current}`;
    setTransition({ id, destination, to, state: { ...state, brandTransitionId: id }, phase: "cover" });
  };

  const completePhase = () => {
    if (!transition) return;
    if (transition.phase === "cover") {
      setTransition((current) => ({ ...current, phase: "navigating" }));
      navigate(transition.to, { state: transition.state });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else if (revealing) {
      focusDestination.current = true;
      setTransition(null);
    }
  };

  return (
    <div onClickCapture={handleClick}>
      <motion.div
        className="brand-page"
        inert={Boolean(transition)}
        animate={{ opacity: transition && !revealing ? 0.45 : 1, y: transition && !revealing ? -14 : 0 }}
        transition={{ duration: reduceMotion ? 0 : revealing ? 0.8 : 0.5, ease: EASE }}
      >
        {children}
      </motion.div>
      {transition && (
        <motion.div
          className={`brand-transition brand-transition--${transition.destination}`}
          role="status"
          aria-live="polite"
          initial={{ y: "100%" }}
          animate={{ y: revealing ? "-100%" : "0%" }}
          transition={{ duration: revealing ? 1 : 0.8, ease: EASE }}
          onAnimationComplete={completePhase}
        >
          <motion.div
            className="brand-transition__identity"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: revealing ? 0 : 1, y: revealing ? -20 : 0 }}
            transition={{ duration: 0.5, delay: revealing ? 0 : 0.18, ease: EASE }}
          >
            {transition.destination === "ardenne" && <img src={ARDENNE_LOGOS.black} alt="" className="brand-transition__logo" width="4000" height="4000" />}
            <span className="brand-transition__eyebrow">{transition.destination === "ardenne" ? "A collection by MOOSTYLES" : "Welcome to"}</span>
            <span className="brand-transition__wordmark">{transition.destination.toUpperCase()}</span>
            <span className="brand-transition__line" aria-hidden="true" />
            <span className="brand-transition__caption">{transition.destination === "ardenne" ? ARDENNE_PUBLIC_COPY.categoryLabels : "Created for your world"}</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
