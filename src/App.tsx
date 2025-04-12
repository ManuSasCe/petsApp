import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PetDetailPage from "./pages/PetDetailPage";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";

const App = () => (
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pet/:id" element={<PetDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
