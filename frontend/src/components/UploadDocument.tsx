import { useState } from 'react';
import { api } from '../api';

export function UploadDocument() {

  const [file, setFile] =
    useState<File | null>(null);

  async function upload() {

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      'file',
      file,
    );

    await api.post(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      },
    );

    alert(
      'Documento processado!',
    );
  }

  return (
    <div>

      <input
        type="file"
        accept=".docx"
        onChange={event =>
          setFile(
            event.target.files?.[0]
            || null,
          )
        }
      />

      <button onClick={upload}>
        Enviar documento
      </button>

    </div>
  );
}