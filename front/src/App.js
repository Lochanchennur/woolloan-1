import React, { useState } from "react";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import ApplicantForm from "./components/ApplicantForm";
import ApplicantReport from "./components/ApplicantReport";
import { processCreditData, evaluateSingleApplicant } from "./utils/creditScoring";

function App() {
  const [datasetName, setDatasetName] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [view, setView] = useState("hero"); // hero | dashboard | form | report
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [currentApplicant, setCurrentApplicant] = useState(null);

  const handleDataLoaded = (data, filename) => {
    setDatasetName(filename);
    const calculatedMetrics = processCreditData(data);
    setMetrics(calculatedMetrics);
    setView("dashboard");
  };

  const handleReset = () => {
    setMetrics(null);
    setDatasetName("");
    setView("hero");
  };

  const startApplicantEvaluation = () => {
    setView("form");
  };

  const handleApplicantEvaluate = (applicantData) => {
    setCurrentApplicant(applicantData);
    const result = evaluateSingleApplicant(applicantData, metrics.raw);
    setEvaluationResult(result);
    setView("report");
  };

  return (
    <div className="app-container">
      {view === "hero" && <Hero onDataLoaded={handleDataLoaded} />}
      
      {view === "dashboard" && (
        <Dashboard 
          metrics={metrics} 
          onReset={handleReset} 
          filename={datasetName} 
          onEvaluateSingle={startApplicantEvaluation} 
        />
      )}
      
      {view === "form" && (
        <ApplicantForm 
          onEvaluate={handleApplicantEvaluate} 
          onBack={() => setView("dashboard")} 
        />
      )}
      
      {view === "report" && (
        <ApplicantReport 
          applicant={currentApplicant} 
          result={evaluationResult} 
          onReset={() => setView("form")} 
          onBack={() => setView("dashboard")} 
        />
      )}
    </div>
  );
}

export default App;