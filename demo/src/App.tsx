import { useState, useEffect } from 'react'
import TgsViewer  from 'react-tgs-viewer';

import './App.css'

const arrayStickers = [
  'https://cdn.denzyve.shop/assets/tgs/gift_5933937398953018107.tgs',
  'https://cdn.denzyve.shop/assets/tgs/gift_6003456431095808759.tgs',
  'https://cdn.denzyve.shop/assets/tgs/gift_5843762284240831056.tgs',
  'https://cdn.denzyve.shop/assets/tgs/gift_5868455043362980631.tgs',
  'https://cdn.denzyve.shop/assets/tgs/gift_5933737850477478635.tgs',
  'https://cdn.denzyve.shop/assets/tgs/gift_6012435906336654262.tgs'
];

function App() {
  const [tgsUrl, setTgsUrl] = useState('https://cdn.denzyve.shop/assets/tgs/gift_5933937398953018107.tgs');
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
            {`Sticker ${idx + 1}`}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#f5f5f5",
          textAlign: "center",
          padding: "12px",
          marginTop: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            color: "#333",
            fontSize: "14px",
            margin: 0,
          }}
        >
          🎁 For more stickers visit{" "}
          <a
            href="https://github.com/denzyve/cdn-telegram-gifts"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2563eb",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Denzyve CDN
          </a>
        </p>
      </div>

    </>
  )
}

export default App
