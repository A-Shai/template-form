import React, { useState } from "react";

const Scorecard = () => {
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
  const [showSurvey, setShowSurvey] = useState(false); // Track survey visibility
  const [submitted, setSubmitted] = useState(false); // Track if survey has been submitted

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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission to stay on the page

    const formData = {
      companyName,
      email,
      contactPerson,
      answers,
      score: calculateScore(),
    };
    console.log("Sending data to backend:", formData); // Debugging log

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/submit-form`, { //change Replace with your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Survey data successfully submitted:", result);
        setSubmitted(true); // Mark survey as submitted and show score
      } else {
        console.log("Error submitting survey:", result);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Health AI & Robotics Solution Maturity Survey</h2>

      {/* Initial form for collecting company info */}
      {!showSurvey ? (
        <>
          <div className="input-group">
            <label className="label">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label className="label">Email Contact</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label className="label">Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            onClick={() => setShowSurvey(true)} // Show the survey after initial info is filled
            disabled={!isFormComplete}
            className={`submit-btn ${isFormComplete ? "enabled" : "disabled"}`}
          >
            Start Survey
          </button>
        </>
      ) : (
        <div className="survey-questions">
          {/* Survey part */}
          {!submitted ? (
            <>
              {questions.map((q, index) => (
                <div key={index} className="question-group">
                  <p className="question-text">{q.text}</p>
                  {q.options.map((option, i) => (
                    <label key={i} className="radio-label">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={i}
                        onChange={() => handleSelection(index, i)}
                        className="radio-input"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              {/* Submit button for survey part */}
              <button
                onClick={handleSubmit} // Submit survey data
                className="submit-btn"
                disabled={answers.includes(null)} // Disable if any answers are missing
              >
                Submit Survey
              </button>
            </>
          ) : (
            <div className="score">
              {/* After submission, display the score */}
              <h3>Your Score: {calculateScore()}</h3>
              <p>{interpretScore(calculateScore())}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scorecard;
