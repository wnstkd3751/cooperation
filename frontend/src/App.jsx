// App.jsx
import { useState } from "react";
import Home from "./pages/Home";
import AddFoodModal from "./components/AddFoodModal";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Home />

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-6 bg-red-400 text-white w-14 h-14 rounded-full"
      >
        +
      </button>

      {open && <AddFoodModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default App;