import { useState, useEffect } from 'react'
import TgsViewer  from 'react-tgs-viewer';

import './App.css'

function App() {
  const [tgsUrl, setTgsUrl] = useState('https://cdn.chatapi.net/stickers/telegram/1c49672ec5dbeef5cfd517996acf2bac/file_10.tgs');
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [tgsUrl]);

  return (
    <>
      <h1>React TGS Viewer</h1>
      <TgsViewer
        key={key}
        tgsUrl={tgsUrl}
        style={{width: 400, height: 400}}
        quality="high"
      />

      <div className='tgs-url-container'>
        <label>
          <span className='tgs-url-label'>TGS URL:</span>
          <input className='tgs-url-input' type="text" value={tgsUrl} onChange={(e) => setTgsUrl(e.target.value)} />
        </label>
      </div>
    </>
  )
}

export default App
