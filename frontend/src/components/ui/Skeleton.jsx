// Skeleton.jsx
// Reusable shimmer placeholder shown while data is loading
// Usage: <Skeleton className="h-4 w-32" /> — height 4, width 32

export default function Skeleton({ className = '' }) {
  return (
    // skeleton class = shimmer animation from index.css
    // className = custom width and height passed from parent
    <div className={`skeleton ${className}`} />
  );
}