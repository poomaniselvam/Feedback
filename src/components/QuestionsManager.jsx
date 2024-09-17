import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionsManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableQuestionId, setEditableQuestionId] = useState(null);

  useEffect(() => {
    // Fetch questions from the API
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://mediumblue-jellyfish-250677.hostingersite.com/api/question'); // Replace with your API endpoint
        setQuestions(response.data.questions);
      } catch (err) {
        setError('Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (e, questionId, optionId) => {
    const { value } = e.target;

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: Array.isArray(question.options)
                ? question.options.map((option) =>
                    option.id === optionId
                      ? { ...option, label: value }
                      : option
                  )
                : question.options,
              label: optionId ? question.label : value,
            }
          : question
      )
    );
  };

  const handleEditClick = (questionId) => {
    setEditableQuestionId((prevId) => (prevId === questionId ? null : questionId));
  };

  const handleSubmit = async () => {
    if (editableQuestionId) {
      const questionToUpdate = questions.find(q => q.id === editableQuestionId);

      try {
        await axios.put(`https://mediumblue-jellyfish-250677.hostingersite.com/api/question/${editableQuestionId}`, questionToUpdate);
        alert('Question updated successfully!');
        setEditableQuestionId(null); // Exit edit mode
      } catch (err) {
        console.error('Failed to update question:', err);
        alert('Failed to update question');
      }
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>


<div className='container'>
<div className='row'>
  <div className='col-lg-12 card px-0 my-5'>
  <div className="card-header">
    Edit Question And Options 
  </div>
<div className=' px-3 my-4  input_css'>

   
     {questions.map((question) => (
            <div className='row' key={question.id}>
          
              <div className='col-lg-4' >
                <div className='d-flex'>
                <i className="bi bi-question css_qustion d-block"></i>
                  <input
                  id='input'
                  type="text"
                  value={question.label}
                  onChange={(e) => handleInputChange(e, question.id)}
                  className="form-control d-block my-2"
                  disabled={editableQuestionId !== question.id}
                />
                </div>
              </div>
              <div className='col-lg-4 mb-4' >
             <ul>
              
                   {Array.isArray(question.options) ? (
                  question.options.map((option) => (
                    <li key={option.id}>
                      <input
                      id='input'
                        type="text"
                        value={option.label}
                        onChange={(e) =>
                          handleInputChange(e, question.id, option.id)
                        }
                        className="form-control my-2"
                        disabled={editableQuestionId !== question.id}
                      />
                    </li>
                  ))
                ) : (
                  <div >No options available</div>
                )}
            
             </ul>
              </div>
              <div className='col-lg-4' >
                <button
                  onClick={() => handleEditClick(question.id)}
                  className="btn btn-primary shadow mt-2"
                >
                  {editableQuestionId === question.id ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>
          ))}

            {editableQuestionId && (
        <button onClick={handleSubmit} className="btn btn-primary mt-4">
          Save Changes
        </button>
      )}
</div>
  </div>
</div>

</div>

 
    
    </div>
  );
};

export default QuestionsManager;
