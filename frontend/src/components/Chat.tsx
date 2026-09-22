import { useState } from 'react';
import { api } from '../api';

export function Chat() {

  const [question, setQuestion] =
    useState('');

  const [answer, setAnswer] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function sendQuestion() {

    if (!question.trim()) {
      return;
    }

    setLoading(true);

    try {

      const response =
        await api.post(
          '/documents/chat',
          {
            question,
          },
        );

      setAnswer(
        response.data.answer,
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div>

      <h1>Assistente RAG</h1>

      <textarea
        value={question}
        onChange={event =>
          setQuestion(
            event.target.value,
          )
        }
        placeholder="Digite sua pergunta..."
      />

      <button
        onClick={sendQuestion}
        disabled={loading}
      >
        {loading
          ? 'Consultando...'
          : 'Perguntar'}
      </button>

      {answer && (
        <div>
          <h2>Resposta</h2>

          <p>{answer}</p>
        </div>
      )}

    </div>
  );
}