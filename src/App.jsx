import ApprovalQueue from "./components/ApprovalQueue";
import "./App.layout.css";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Autonomous Database Optimizer</h1>
        <p className="app-subtitle">Approval queue — recommendations pending review</p>
      </header>
      <main>
        <ApprovalQueue />
      </main>
    </div>
  );
}

export default App;
