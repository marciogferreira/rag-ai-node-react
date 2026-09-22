import { Chat } from './components/Chat';
import { UploadDocument } from './components/UploadDocument';

function App() {

  return (
    <main>
      <h1>
        RAG Assistant
      </h1>
      <UploadDocument />
      <hr />
      <Chat />
    </main>
  );
}

export default App;