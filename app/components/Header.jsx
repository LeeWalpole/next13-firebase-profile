export default function Header({ title, description, className }) {
  return (
    <header className={`${className}`}>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
