import { useState, useEffect } from 'react'
import TgsViewer  from 'react-tgs-viewer';

import './App.css'

const arrayStickers = [
  'https://denzyve.github.io/tgs-cdn/assets/sticker0.tgs',
  'https://denzyve.github.io/tgs-cdn/assets/sticker1.tgs',
  'https://denzyve.github.io/tgs-cdn/assets/sticker2.tgs',
  'https://denzyve.github.io/tgs-cdn/assets/sticker3.tgs',
];

function App() {
  const [tgsUrl, setTgsUrl] = useState('https://denzyve.github.io/tgs-cdn/assets/sticker.tgs');
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

      <div className='stickers-list'>
        {arrayStickers.map((url, idx) => (
          <button
            key={url}
            onClick={() => setTgsUrl(url)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              background: tgsUrl === url ? '#1976d2' : '#eee',
              color: tgsUrl === url ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {`Стикер ${idx + 1}`}
          </button>
        ))}
      </div>
    </>
  )
}

export default App
