import { useState, useEffect } from 'react'
import { FiShuffle, FiRefreshCw, FiPlus, FiTrash2 } from 'react-icons/fi'
import { truthOrDareService } from '../firebase/db'

const defaultTruthQuestions = [
  "What's the most embarrassing thing that happened to you on a trip?",
  "What's your biggest fear about this trip?",
  "What's the weirdest food you've ever eaten?",
  "What's your most irrational fear?",
  "What's the most trouble you've ever been in?",
  "What's your biggest pet peeve about traveling with others?",
  "What's the most embarrassing thing in your search history?",
  "What's your biggest regret from high school?",
  "What's the most childish thing you still do?",
  "What's your biggest insecurity?",
  "What's the most embarrassing thing you've done to impress someone?",
  "What's your biggest guilty pleasure?",
  "What's the most embarrassing thing you've ever worn?",
  "What's your biggest fear about the future?",
  "What's the most embarrassing thing you've ever said in public?"
]

const defaultDareChallenges = [
  "Call your mom and tell her you're getting married tomorrow",
  "Let someone in the group style your hair however they want",
  "Do your best impression of someone in the group",
  "Sing your favorite song at the top of your lungs",
  "Dance like nobody's watching for 2 minutes",
  "Let someone in the group post something on your social media",
  "Wear your clothes backwards for the next hour",
  "Speak in a different accent for the next 10 minutes",
  "Let someone in the group choose your next meal",
  "Do 20 jumping jacks right now",
  "Let someone in the group take a silly photo of you",
  "Tell a joke that makes everyone laugh",
  "Let someone in the group choose your outfit for tomorrow",
  "Do your best animal impression",
  "Let someone in the group give you a new nickname for the rest of the trip"
]

function TruthOrDare({ currentUser }) {
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [questionType, setQuestionType] = useState('')
  const [showQuestion, setShowQuestion] = useState(false)
  const [customTruthQuestions, setCustomTruthQuestions] = useState([])
  const [customDareChallenges, setCustomDareChallenges] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomQuestion, setNewCustomQuestion] = useState('')
  const [newCustomType, setNewCustomType] = useState('truth')

  const tripGroup = currentUser?.tripGroup || 'default'

  // Real-time listeners for custom questions
  useEffect(() => {
    if (!currentUser?.tripGroup) return

    try {
      const unsubscribeTruth = truthOrDareService.subscribe(
        tripGroup, 
        'truth', 
        (questions) => {
          setCustomTruthQuestions(questions || [])
        },
        (error) => {
          console.error('Error loading truth questions:', error)
        }
      )

      const unsubscribeDare = truthOrDareService.subscribe(
        tripGroup, 
        'dare', 
        (questions) => {
          setCustomDareChallenges(questions || [])
        },
        (error) => {
          console.error('Error loading dare questions:', error)
        }
      )

      return () => {
        unsubscribeTruth()
        unsubscribeDare()
      }
    } catch (error) {
      console.error('Error setting up truth or dare listeners:', error)
    }
  }, [tripGroup, currentUser?.tripGroup])

  const addCustomQuestion = async (e) => {
    e.preventDefault()
    if (newCustomQuestion.trim()) {
      try {
        const question = {
          text: newCustomQuestion.trim(),
          type: newCustomType
        }
        await truthOrDareService.add(tripGroup, newCustomType, question)
        setNewCustomQuestion('')
        setShowAddForm(false)
      } catch (error) {
        console.error('Error adding custom question:', error)
        alert('Failed to add question. Please try again.')
      }
    }
  }

  const deleteCustomQuestion = async (questionId, type) => {
    try {
      await truthOrDareService.delete(tripGroup, type, questionId)
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question. Please try again.')
    }
  }

  const generateQuestion = (type) => {
    const defaultQuestions = type === 'truth' ? defaultTruthQuestions : defaultDareChallenges
    const customQuestions = type === 'truth' ? customTruthQuestions : customDareChallenges
    const allQuestions = [...defaultQuestions, ...customQuestions.map(q => q.text)]
    
    if (allQuestions.length === 0) {
      setCurrentQuestion('No questions available! Add some custom questions.')
      setQuestionType(type)
      setShowQuestion(true)
      return
    }
    
    const randomIndex = Math.floor(Math.random() * allQuestions.length)
    const question = allQuestions[randomIndex]
    
    setCurrentQuestion(question)
    setQuestionType(type)
    setShowQuestion(true)
  }

  const resetGame = () => {
    setCurrentQuestion('')
    setQuestionType('')
    setShowQuestion(false)
  }

  return (
    <div>
      <h1 className="pixel-title">🎲 Truth or Dare</h1>

      {!showQuestion ? (
        <div className="pixel-card" style={{ textAlign: 'center' }}>
          <h2 className="pixel-subtitle">Choose Your Fate!</h2>
          <p style={{ marginBottom: '32px', fontSize: '18px' }}>
            Pick between Truth or Dare to start the game!
          </p>
          
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="pixel-button"
              onClick={() => generateQuestion('truth')}
              style={{ 
                background: 'var(--primary-color)', 
                fontSize: '18px',
                padding: '20px 40px'
              }}
            >
              <FiShuffle size={20} style={{ marginRight: '12px' }} />
              TRUTH
            </button>
            
            <button
              className="pixel-button"
              onClick={() => generateQuestion('dare')}
              style={{ 
                background: 'var(--secondary-color)', 
                fontSize: '18px',
                padding: '20px 40px'
              }}
            >
              <FiShuffle size={20} style={{ marginRight: '12px' }} />
              DARE
            </button>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <button
              className="pixel-button"
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ background: 'var(--accent-color)', color: 'var(--dark-color)' }}
            >
              <FiPlus size={16} style={{ marginRight: '8px' }} />
              Add Custom Questions
            </button>
          </div>
        </div>
      ) : (
        <div className="truth-dare-card">
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                background: questionType === 'truth' ? 'var(--primary-color)' : 'var(--secondary-color)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 'var(--border-radius)',
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '12px',
                textTransform: 'uppercase'
              }}
            >
              {questionType.toUpperCase()}
            </span>
          </div>
          
          <div className="truth-dare-text">
            {currentQuestion}
          </div>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="pixel-button"
              onClick={() => generateQuestion(questionType)}
              style={{ background: 'var(--accent-color)', color: 'var(--dark-color)' }}
            >
              <FiRefreshCw size={16} style={{ marginRight: '8px' }} />
              New {questionType === 'truth' ? 'Truth' : 'Dare'}
            </button>
            
            <button
              className="pixel-button"
              onClick={resetGame}
              style={{ background: 'var(--error-color)' }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">Add Custom Question</h2>
          <form onSubmit={addCustomQuestion}>
            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Question Type:</label>
              <select
                className="pixel-input"
                value={newCustomType}
                onChange={(e) => setNewCustomType(e.target.value)}
              >
                <option value="truth">Truth</option>
                <option value="dare">Dare</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="pixel-subtitle">Your Question:</label>
              <textarea
                className="pixel-input"
                value={newCustomQuestion}
                onChange={(e) => setNewCustomQuestion(e.target.value)}
                placeholder="Enter your custom truth or dare question..."
                required
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="pixel-button">
                Add Question
              </button>
              <button
                type="button"
                className="pixel-button"
                onClick={() => setShowAddForm(false)}
                style={{ background: 'var(--error-color)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Questions Lists */}
      {(customTruthQuestions.length > 0 || customDareChallenges.length > 0) && (
        <div className="pixel-card">
          <h2 className="pixel-subtitle">Custom Questions</h2>
          
          {customTruthQuestions.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>Custom Truth Questions:</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {customTruthQuestions.map((question) => (
                  <div key={question.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', border: '1px solid var(--dark-color)', borderRadius: 'var(--border-radius)' }}>
                    <span>{question.text}</span>
                    <button
                      className="pixel-button"
                      onClick={() => deleteCustomQuestion(question.id, 'truth')}
                      style={{ background: 'var(--error-color)', padding: '4px 8px' }}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {customDareChallenges.length > 0 && (
            <div>
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '12px' }}>Custom Dare Challenges:</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {customDareChallenges.map((question) => (
                  <div key={question.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', border: '1px solid var(--dark-color)', borderRadius: 'var(--border-radius)' }}>
                    <span>{question.text}</span>
                    <button
                      className="pixel-button"
                      onClick={() => deleteCustomQuestion(question.id, 'dare')}
                      style={{ background: 'var(--error-color)', padding: '4px 8px' }}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pixel-card">
        <h2 className="pixel-subtitle">How to Play</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', border: '2px solid var(--primary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>🎯 Truth</h3>
            <p style={{ margin: 0 }}>Answer the question honestly, no matter how embarrassing!</p>
          </div>
          
          <div style={{ padding: '16px', border: '2px solid var(--secondary-color)', borderRadius: 'var(--border-radius)', background: 'var(--light-color)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--secondary-color)' }}>⚡ Dare</h3>
            <p style={{ margin: 0 }}>Complete the challenge, no backing out!</p>
          </div>
        </div>
      </div>

      <div className="pixel-card">
        <h2 className="pixel-subtitle">Game Rules</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--dark-color)' }}>
            🎮 Take turns choosing Truth or Dare
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--dark-color)' }}>
            🤝 Be respectful and don't make anyone uncomfortable
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--dark-color)' }}>
            📱 You can skip a question, but you owe the group a favor
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--dark-color)' }}>
            ✨ Add your own custom questions to make it more personal!
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--dark-color)' }}>
            🎉 Have fun and don't take it too seriously!
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TruthOrDare 