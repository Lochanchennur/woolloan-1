import React, { useState } from "react";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import ApplicantForm from "./components/ApplicantForm";
import ApplicantReport from "./components/ApplicantReport";
import HelpPage from "./components/HelpPage";
import WizardHelper from "./components/WizardHelper";
import { processCreditData, evaluateSingleApplicant } from "./utils/creditScoring";
import { HelpCircle } from "lucide-react";

function App() {
  const [datasetName, setDatasetName] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [view, setView] = useState("hero"); // hero | dashboard | form | report | help
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDataLoaded = (data, filename) => {
    setDatasetName(filename);
    const calculatedMetrics = processCreditData(data);
    setMetrics(calculatedMetrics);
    setView("dashboard");
    showToast(`Successfully analyzed ${calculatedMetrics.totalUsers.toLocaleString()} records!`);
  };

  const handleReset = () => {
    setMetrics(null);
    setDatasetName("");
    setView("hero");
    showToast("Model reset successfully.", "info");
  };

  const startApplicantEvaluation = () => {
    setView("form");
  };

  const handleApplicantEvaluate = (applicantData) => {
    setCurrentApplicant(applicantData);
    const result = evaluateSingleApplicant(applicantData, metrics.raw);
    setEvaluationResult(result);
    setView("report");
    showToast("Applicant Assessment Complete!", result.riskScore > 60 ? "error" : "success");
  };

  // Determine Wizard Message based on current view
  let wizardMessage = "";
  if (view === "hero") wizardMessage = "Greetings! I'm your Risk Assessor Aide. Upload a CSV dataset to begin the magic!";
  if (view === "dashboard") wizardMessage = `Dataset loaded! We analyzed ${metrics?.totalUsers.toLocaleString()} profiles. Click 'Assess Applicant' to simulate a single loan.`;
  if (view === "form") wizardMessage = "Please enter the applicant's details. I'll compare them against our historical baseline.";
  if (view === "report") wizardMessage = "Here is my evaluation! Read the risk factors carefully before making a lending decision.";
  if (view === "help") wizardMessage = "This documentation explains our mock-ML model and application architecture.";

  return (
    <div className="app-container">

      {/* Global Navigation / Help Button */}
      {view !== 'help' && (
        <button
          onClick={() => setView('help')}
          style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center', zIndex: 10 }}
          className="btn"
        >
          <HelpCircle size={20} /> <span style={{ fontFamily: 'Playfair Display' }}>Help & Docs</span>
        </button>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Animated View Wrappers */}
      {view === "hero" && (
        <div className="page-enter">
          <Hero onDataLoaded={handleDataLoaded} />
        </div>
      )}

      {view === "dashboard" && (
        <div className="page-enter">
          <Dashboard
            metrics={metrics}
            onReset={handleReset}
            filename={datasetName}
            onEvaluateSingle={startApplicantEvaluation}
          />
        </div>
      )}

      {view === "form" && (
        <div className="page-enter">
          <ApplicantForm
            onEvaluate={handleApplicantEvaluate}
            onBack={() => setView("dashboard")}
          />
        </div>
      )}

      {view === "report" && (
        <div className="page-enter">
          <ApplicantReport
            applicant={currentApplicant}
            result={evaluationResult}
            onReset={() => setView("form")}
            onBack={() => setView("dashboard")}
          />
        </div>
      )}

      {view === "help" && (
        <div className="page-enter">
          <HelpPage onBack={() => {
            if (metrics) setView("dashboard");
            else setView("hero");
          }} />
        </div>
      )}

      {/* Floating Wizard Helper */}
      <WizardHelper message={wizardMessage} isVisible={true} />
    </div>
  );
}

export default App;