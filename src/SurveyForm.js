import React, { useState } from "react";

const SurveyForm = () => {
  const questions = [
    {
      text: "How would you describe the current development stage of your AI or robotics solution?",
      options: ["Conceptualization", "Prototype Development", "Pilot Testing", "Market-Ready Product"],
    },
    {
      text: "What is the status of your solution's regulatory compliance?",
      options: ["Unfamiliar with Regulatory Requirements", "Initial Research", "Active Engagement", "Certified Compliance"],
    },
    {
      text: "How developed is your business strategy for market entry?",
      options: ["No Formal Strategy", "Basic Plan", "Comprehensive Strategy", "Execution Phase"],
    },
    {
      text: "What is the current status of your solution's certification and validation?",
      options: ["Not Initiated", "Planning Stage", "In Progress", "Fully Certified"],
    },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [showSurvey, setShowSurvey] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelection = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.reduce((acc, curr) => acc + (curr !== null ? curr + 1 : 0), 0);
  };

  const interpretScore = (score) => {
    if (score >= 4 && score <= 7) return "Early Development Stage: Consider engaging with TEF-Health for support.";
    if (score >= 8 && score <= 11) return "Intermediate Stage: Focus on advancing compliance and refining business strategy.";
    if (score >= 12 && score <= 15) return "Advanced Stage: Nearing market readiness; prioritize finalizing certifications.";
    if (score === 16) return "Market-Ready: Ready for deployment; leverage TEF-Health services for scaling.";
    return "Please complete all questions to get your assessment.";
  };

  const isFormComplete = companyName && email && contactPerson;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Health AI and Robotics Solution Maturity Survey</h2>
      
      {!submitted ? (
        <>
          {!showSurvey ? (
            <form onSubmit={() => setShowSurvey(true)} className="space-y-4">
              <div>
                <label className="block font-semibold">Company Name</label>
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Email Contact</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Contact Person</label>
                <input 
                  type="text" 
                  value={contactPerson} 
                  onChange={(e) => setContactPerson(e.target.value)} 
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!isFormComplete}
                className={`w-full p-2 rounded text-white ${isFormComplete ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Start Survey
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {questions.map((q, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{q.text}</p>
                  {q.options.map((option, i) => (
                    <label key={i} className="block mt-1">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={i}
                        onChange={() => handleSelection(index, i)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
                Submit
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold">Your Score: {calculateScore()}</h3>
          <p className="mt-2">{interpretScore(calculateScore())}</p>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;
