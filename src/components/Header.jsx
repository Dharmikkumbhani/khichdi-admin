export default function Header() {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="admin-header">
      <h1>Khichdi Admin Portal 🍛</h1>
      <div className="date-display">{currentDate}</div>
    </header>
  );
}
