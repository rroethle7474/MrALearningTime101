import { TutorialContent } from '../types/tutorial'

export const sampleTutorial: TutorialContent = {
  summary: [
    "React Hooks provide a way to use state and other React features in functional components.",
    "They simplify component logic and promote code reuse through custom hooks."
  ],
  keyPoints: [
    "Hooks must be called at the top level of your function",
    "Hooks can only be used in React function components or custom hooks",
    "useState provides state management in functional components",
    "useEffect handles side effects and lifecycle events"
  ],
  codeExamples: [
    {
      language: "typescript",
      code: `function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`,
      explanation: "A simple counter component using the useState hook to manage state."
    },
    {
      language: "typescript",
      code: `useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])`,
      explanation: "Using useEffect to update the document title whenever count changes."
    }
  ],
  practiceExercises: [
    {
      question: "Create a toggle component using the useState hook",
      solution: `function Toggle() {
  const [isOn, setIsOn] = useState(false)
  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )
}`,
      hints: [
        "Think about what type of state you need",
        "Consider what the toggle action should do"
      ]
    }
  ],
  additionalNotes: [
    "Custom hooks can be created to share stateful logic between components",
    "The useEffect cleanup function runs before the component is removed from the UI"
  ]
} 