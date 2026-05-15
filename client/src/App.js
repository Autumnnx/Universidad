import { useState, useEffect } from 'react';
import './App.css';

function App() {


    //memoria del formulario
    //crear los estados
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [titulo, setTitulo] = useState("");
    const [areaAcademica, setAreaAcademica] = useState("");
    const [dedicacion, setDedicacion] = useState("");
    const [aniosExperiencia, setAniosExperiencia] = useState(0);

    const [registros, setRegistros] = useState([]);

    const [editIndex, setEditIndex] = useState(null);


    useEffect(() => {
      cargarDocentes();
    }, []);


    const cargarDocentes = async () => {
      try {
        const response = await fetch('http://localhost:3001/docentes');
        const data = await response.json();
        setRegistros(data);
      } catch (error) {
        alert('Error al cargar los docentes');
      }
    };

    const limpiarFormulario = () => {
      setNombre('');
      setCorreo('');
      setTelefono('');
      setTitulo('');
      setAreaAcademica('');
      setDedicacion('')
      setAniosExperiencia(0);
    };


    const registrarDatos = async (e) => {

      e.preventDefault();

      const payload = {
        nombre,
        correo,
        telefono,
        titulo,
        area_academica: areaAcademica,
        dedicacion,
        anios_experiencia: aniosExperiencia,
      };

      if (editIndex !== null) {
        //camino de ACTUALIZAR
        try {
          const docente = registros[editIndex];
          const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const nuevosRegistros = [...registros];
            nuevosRegistros[editIndex] = {
              ...docente,
              nombre,
              correo,
              telefono,
              titulo,
              area_academica: areaAcademica,
              dedicacion,
              anios_experiencia: aniosExperiencia,
            };
            setRegistros(nuevosRegistros);
            setEditIndex(null);
            alert('Docente actualizado correctamente');
          } else {
            const err = await response.json().catch(() => ({}));
            alert(err.error || 'Error al actualizar el docente');
          }
        } catch (error) {
          alert('Error de conexion al actualizar un docente');
        }

      } else {
        try {
          //camino de GUARDAR 
          const response = await fetch('http://localhost:3001/docentes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const data = await response.json();
          if (response.ok) {
            setRegistros([...registros, data]);
            alert('Docente guardado correctamente');
          } else {
            alert(data.error || 'Error al guardar el docente');
          }
        } catch (error) {
          alert('Error de conexion al guardar');
        }
      }
      limpiarFormulario();
    };


    const eliminarRegistro = async (idx) => {
      const docente = registros[idx];

      try {
        const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRegistros(registros.filter((_, i) => i !== idx));
          if (editIndex === idx) {
            setEditIndex(null);
            limpiarFormulario();
          }
          alert('Docente eliminado');
        } else {
          alert('Error al eliminar el docente');
        }
      } catch (error) {
        alert('Error de conexion');
      }
    };


    const editarRegistro = (idx) => {
      const reg = registros[idx];
      setNombre(reg.nombre);
      setCorreo(reg.correo);
      setTelefono(reg.telefono);
      setTitulo(reg.titulo);
      setAreaAcademica(reg.area_academica);
      setDedicacion(reg.dedicacion);
      setAniosExperiencia(reg.anios_experiencia);
      setEditIndex(idx);

    };

  return (
    <div className="container">
      <h1>Gestión de Docentes</h1>

      {/* Formulario de Registro / Edición */}
      <section className="form-section">
        <h2>{editIndex !== null ? 'Editar Docente' : 'Registrar Nuevo Docente'}</h2>
        <form onSubmit={registrarDatos}>
          <div className="input-group">
            <label>Nombre Completo:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className="input-group">
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="input-group">
            <label>Teléfono:</label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              placeholder="300..."
            />
          </div>

          <div className="input-group">
            <label>Título Académico:</label>
            <input 
              type="text" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              placeholder="Ej. Ingeniero de Sistemas"
            />
          </div>

          <div className="input-group">
            <label>Área Académica:</label>
            <input 
              type="text" 
              value={areaAcademica} 
              onChange={(e) => setAreaAcademica(e.target.value)} 
              placeholder="Ej. Software"
            />
          </div>

          <div className="input-group">
            <label>Dedicación:</label>
            <select value={dedicacion} onChange={(e) => setDedicacion(e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="Tiempo Completo">Tiempo Completo</option>
              <option value="Medio Tiempo">Medio Tiempo</option>
              <option value="Cátedra">Cátedra</option>
            </select>
          </div>

          <div className="input-group">
            <label>Años de Experiencia:</label>
            <input 
              type="number" 
              value={aniosExperiencia} 
              onChange={(e) => setAniosExperiencia(parseInt(e.target.value))} 
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editIndex !== null ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" onClick={limpiarFormulario} className="btn-clear">
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <hr />

      {/* Tabla de Visualización de Datos */}
      <section className="table-section">
        <h2>Listado de Docentes</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Título</th>
              <th>Área</th>
              <th>Dedicación</th>
              <th>Exp.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((docente, index) => (
              <tr key={docente._id || index}>
                <td>{docente.nombre}</td>
                <td>{docente.correo}</td>
                <td>{docente.telefono}</td>
                <td>{docente.titulo}</td>
                <td>{docente.area_academica}</td>
                <td>{docente.dedicacion}</td>
                <td>{docente.anios_experiencia} años</td>
                <td>
                  <button onClick={() => editarRegistro(index)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => eliminarRegistro(index)} className="btn-delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
