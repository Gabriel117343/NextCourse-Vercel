"use client";
import Head from "next/head";
import { useState } from "react";
import Dropzone from "react-dropzone";

export default function page() {
  const [files, setFiles] = useState([]);
  const [customText, setCustomText] = useState("");
  const [generatedDocs, setGeneratedDocs] = useState("");
  const [filePreview, setFilePreview] = useState("");

  // Handle file upload and preview
  const handleFileUpload = (acceptedFiles ) => {
    setFiles(acceptedFiles);

    if (acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setFilePreview(e.target.result);
      };
      reader.readAsText(acceptedFiles[0]);
    }
  };

  // Simulate documentation generation
  const generateDocumentation = () => {
    const fileContent =
      files.length > 0 ? `Contenido del archivo:\n${files[0].name}` : "";
    const result = `# Documentación Generada\n\n${fileContent}\n\nPersonalización: ${customText}`;
    setGeneratedDocs(result);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
     

      {/* Contenido Principal */}
      <div className="flex flex-grow p-4">
        {/* Historial de Chats (Panel Izquierdo) */}
        <aside className="w-1/4 bg-white rounded-lg shadow-md p-4 mr-4">
          <h2 className="text-lg font-semibold mb-4">Historial de Chats</h2>
          <ul className="space-y-2">
            <li className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
              Chat 1
            </li>
            <li className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
              Chat 2
            </li>
          </ul>
        </aside>

        {/* Chat Activo (Panel Central) */}
        <section className="flex-1 bg-white rounded-lg shadow-md p-4 mr-4">
          <h2 className="text-lg font-semibold mb-4">Chat Activo</h2>

          {/* Zona de Subida de Archivos */}
          <Dropzone
            onDrop={handleFileUpload}
            accept={{ "application/typescript": [".js", ".jsx", ".ts", ".tsx"] }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg mb-4 cursor-pointer"
              >
                <input {...getInputProps()} />
                <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionar.</p>
              </div>
            )}
          </Dropzone>

          {/* Vista Previa del Archivo */}
          {files.length > 0 && (
            <div className="mb-4 max-w-full md:max-w-2xl mx-auto">
              <h3 className="text-md font-semibold mb-2">Archivo Subido:</h3>
              <button
                className="text-blue-500 underline mb-2"
                onClick={() => alert(`Mostrar contenido de ${files[0].name}`)}
              >
                {files[0].name}
              </button>
              {filePreview && (
                <pre className="overflow-y-scroll h-64 border p-2 text-sm break-words">
                  {filePreview}
                </pre>
              )}
            </div>
          )}

          {/* Campo de Texto Personalizado */}
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Añade texto para personalizar la salida..."
            className="w-full p-2 border rounded-lg mb-4"
            rows={3}
          ></textarea>

          {/* Botón para Generar Documentación */}
          <button
            onClick={generateDocumentation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Generar Documentación
          </button>
        </section>

        {/* Resultado (Panel Derecho) */}
        <aside className="w-1/3 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Resultado</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg">
            {generatedDocs || "Aquí aparecerá la documentación generada."}
          </pre>
        </aside>
      </div>
    </div>
  );
}