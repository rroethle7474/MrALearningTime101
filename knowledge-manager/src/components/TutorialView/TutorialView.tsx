import { TutorialContent } from '../../types/tutorial'
import './TutorialView.css'

interface TutorialViewProps {
  tutorial: TutorialContent
}

export function TutorialView({ tutorial }: TutorialViewProps) {
  return (
    <div className="tutorial-view">
      <section className="tutorial-section">
        <h3>Summary</h3>
        <div className="summary-points">
          {tutorial.summary.map((point, index) => (
            <p key={index}>{point}</p>
          ))}
        </div>
      </section>

      <section className="tutorial-section">
        <h3>Key Points</h3>
        <ul className="key-points">
          {tutorial.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="tutorial-section">
        <h3>Code Examples</h3>
        <div className="code-examples">
          {tutorial.codeExamples.map((example, index) => (
            <div key={index} className="code-example">
              <pre className="code-block">
                <code>{example.code}</code>
              </pre>
              <p className="code-explanation">{example.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tutorial-section">
        <h3>Practice Exercises</h3>
        <div className="practice-exercises">
          {tutorial.practiceExercises.map((exercise, index) => (
            <div key={index} className="exercise">
              <h4>Exercise {index + 1}</h4>
              <p className="question">{exercise.question}</p>
              {exercise.hints && (
                <div className="hints">
                  <h5>Hints:</h5>
                  <ul>
                    {exercise.hints.map((hint, hintIndex) => (
                      <li key={hintIndex}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
              <details className="solution">
                <summary>View Solution</summary>
                <pre>
                  <code>{exercise.solution}</code>
                </pre>
              </details>
            </div>
          ))}
        </div>
      </section>

      {tutorial.additionalNotes && (
        <section className="tutorial-section">
          <h3>Additional Notes</h3>
          <ul className="additional-notes">
            {tutorial.additionalNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
} 