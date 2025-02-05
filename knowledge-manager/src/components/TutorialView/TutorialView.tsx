import { TutorialContent } from '../../types/tutorial'
import './TutorialView.css'

interface TutorialViewProps {
  tutorial: TutorialContent;
}

export function TutorialView({ tutorial }: TutorialViewProps) {
  return (
    <div className="tutorial-view">
      <section id="summary" className="tutorial-section">
        <h3>Summary</h3>
        <p>{tutorial.summary}</p>
      </section>

      <section id="key-points" className="tutorial-section">
        <h3>Key Points</h3>
        <ul>
          {tutorial.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      <section id="code-examples" className="tutorial-section">
        <h3>Code Examples</h3>
        {tutorial.codeExamples.map((example, index) => (
           <div key={index} className="code-example">
           <pre className="code-block">
             <code>{example.code}</code>
           </pre>
           <p className="code-explanation">{example.explanation}</p>
         </div>
        ))}
      </section>

      <section id="practice-examples" className="tutorial-section">
        <h3>Practice Examples</h3>
        {tutorial.practiceExercises.map((exercise, index) => (
          <div key={index} className="practice-example">
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
      </section>

      <section id="additional-notes" className="tutorial-section">
        <h3>Additional Notes</h3>
        <div className="notes-content">
          {tutorial.additionalNotes.map((note, index) => (
            <p key={index}>{note}</p>
          ))}
        </div>
      </section>
    </div>
  )
} 