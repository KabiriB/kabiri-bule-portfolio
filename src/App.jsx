import { useEffect, useState } from "react";
import PortfolioLab from "./PortfolioLab";
import DecisionRoom from "./pages/DecisionRoom";
import MethodExperiment from "./pages/MethodExperiment";
import MonitoringLab from "./pages/MonitoringLab";

const currentView = () => {
  if (typeof window === "undefined") return "home";
  const route = window.location.hash;
  if (route === "#/dashboard") return "dashboard";
  if (route === "#/experiment") return "experiment";
  if (route === "#/monitoring") return "monitoring";
  return "home";
};
export default function App() {
  const [view, setView] = useState(currentView);
  useEffect(() => {
    const change = () => {
      setView(currentView());
      if (window.location.hash.startsWith("#/")) window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const titles = {
      home: "Kabiri Bule — Research, Data & Technology",
      dashboard: "The System Signals Room — Kabiri Bule",
      experiment: "When the Average Gets the Story Wrong — Kabiri Bule",
      monitoring: "From Activity to Credible Evidence — Kabiri Bule"
    };
    document.title = titles[view];
  }, [view]);
  if (view === "dashboard") return <DecisionRoom />;
  if (view === "experiment") return <MethodExperiment />;
  if (view === "monitoring") return <MonitoringLab />;
  return <PortfolioLab />;
}
