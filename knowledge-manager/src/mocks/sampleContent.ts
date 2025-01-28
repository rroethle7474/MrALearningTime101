import { ProcessedContent } from '../types/content'

export const sampleContent: ProcessedContent = {
  metadata: {
    title: "Understanding React Hooks",
    author: "React Team",
    duration: "15:30",
    sourceUrl: "https://youtube.com/watch?v=example",
    type: "youtube"
  },
  sections: [
    {
      id: "intro",
      title: "Introduction to Hooks",
      content: "React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class component.\n\nHooks allow you to reuse stateful logic without changing your component hierarchy.",
      timestamp: "0:00"
    },
    {
      id: "useState",
      title: "useState Hook",
      content: "The useState hook is the most basic hook in React. It allows you to add state to functional components.\n\nIt returns an array with two elements: the current state value and a function to update it.",
      timestamp: "3:45"
    },
    {
      id: "useEffect",
      title: "useEffect Hook",
      content: "The useEffect hook lets you perform side effects in function components.\n\nIt serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.",
      timestamp: "7:20"
    },
    {
      id: "rules",
      title: "Rules of Hooks",
      content: "There are two main rules when using hooks:\n\n1. Only call hooks at the top level of your function\n2. Only call hooks from React function components or custom hooks",
      timestamp: "11:15"
    }
  ]
} 