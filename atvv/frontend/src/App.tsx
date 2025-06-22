import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Titulares from "./pages/Titulares"
import EditarTitular from "./pages/EditarTitular"
import Acomodacoes from "./pages/Acomodacoes"
import Hospedagens from "./pages/Hospedagens"
import Dependentes from "./pages/Dependentes"
import EditarDependente from "./pages/EditarDependente"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Titulares />} />
         <Route path="/dependentes" element={<Dependentes />} />
        <Route path="/editar-titular/:id" element={<EditarTitular />} />
        <Route path="/editar-dependente/:id" element={<EditarDependente />} />
        <Route path="/acomodacoes" element={<Acomodacoes />} />
        <Route path="/hospedagens" element={<Hospedagens />} />
      </Routes>
    </Layout>
  )
}

export default App
