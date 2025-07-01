import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Singin from "./views/admin/singin";
import DashboardAdmin from "./views/admin/Dashboard";
import DashboardAlumno from "./views/alumno/DashboardAlumno";
import PublicRoutes from "./components/routes/PublicRoutes";
import AdminRoutes from "./components/routes/AdminRoutes";
import AlumnoRoutes from "./components/routes/AlumnoRoutes";
import Forbidden from "./views/Forbidden";
import VerAlumnos from "./views/admin/listaAlumnsos";
import CrearCarrera from "./views/admin/AddCarrera";
import VerCarreras from "./views/admin/listaCarreras"
import AsignarCarrera from "./views/admin/asignarCarreras"
import CargarPago from "./views/admin/cargarPago";
import VerPagos from "./views/admin/VerPagos";
import MisPagos from "./views/alumno/PagosAlumno";
import MiPerfil from "./views/alumno/perfil";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rutas públicas === */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* === Rutas protegidas para ADMIN === */}
        <Route element={<AdminRoutes />}>
          <Route path="/dashboard" element={<DashboardAdmin />} />
          <Route path="/singin" element={<Singin />} />
          <Route path="/admin/alumnos/lista" element={<VerAlumnos />} />
          <Route path="/admin/carrera/nueva" element={<CrearCarrera />} />
          <Route path="/admin/carrera/lista" element={<VerCarreras />} />
          <Route path="/admin/carrera/asignar" element={<AsignarCarrera />} /> 
          <Route path="/admin/cargar/pago" element={<CargarPago />} />  
          <Route path="/admin/ver/pago" element={<VerPagos />} />          
        </Route>

        {/* === Rutas protegidas para ALUMNO === */}
        <Route element={<AlumnoRoutes />}>
          <Route path="/alumno/dashboard" element={<DashboardAlumno />} />
          <Route path="/alumno/mis/pagos" element={<MisPagos />} />  
          <Route path="/alumno/mi/perfil" element={<MiPerfil />} />        
        </Route>
        

        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
