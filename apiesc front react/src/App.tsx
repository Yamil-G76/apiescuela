
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Singin from "./views/singin";
import Dashboard from "./views/Dashboard";
import PublicRoutes from "./components/routes/PublicRoutes";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";


function App() {
 return (
   <BrowserRouter>
     <Routes>
       <Route element={<PublicRoutes />}>
         <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
       </Route>
       
       <Route path="/singin" element={<Singin/>}/>
       <Route element={<ProtectedRoutes />}>
         <Route path="/dashboard" element={<Dashboard />} />
       </Route>
     </Routes>
   </BrowserRouter>
 );
}
export default App
