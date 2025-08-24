# React .TGS Viewer

[![React Telegram Sticker Viewer](https://img.youtube.com/vi/aAvJIkxAPSE/0.jpg)](https://youtu.be/aAvJIkxAPSE "React Telegram Sticker Viewer")

## Install

```bash
$ npm install react-tgs-viewer
or
$ pnpm install react-tgs-viewer
```

## Usage

For a live demo, visit: [https://denzyve.github.io/react-tgs-viewer/](https://denzyve.github.io/react-tgs-viewer/)

### Example

```tsx
import React, { useState } from 'react';
import TgsViewer from 'react-tgs-sticker';

const App: React.FC = () => {
  const [tgsUrl, setTgsUrl] = useState<string>(
    'https://denzyve.github.io/tgs-cdn/assets/sticker0.tgs'
  );

  return (
    <TgsViewer
      tgsUrl={tgsUrl}
      style={{ height: '300px', width: '300px' }}
      quality="high"
    />
  );
};

export default App;
```

## Props of Component

- **`tgsUrl`** *(required, string)*  
  The URL of the Telegram Sticker (TGS file) to be displayed.

- **`staticPreviewUrl`** *(optional, string)*  
  Optional static image to display while .tgs is loading or in case of error.

- **`corsProxyServerUrl`** *(optional, string)*  
  Custom CORS proxy URL if you encounter CORS issues when fetching `.tgs` files.

- **`style`** *(optional, object)*  
  The style of the sticker viewer. Default is `{ height: '100px', width: '100px' }`.

- **`quality`** *(optional, "low" | "medium" | "high")*  
  Controls animation frame rate for performance optimization. Default: `"high"`.

## LICENSE

MIT @ [denzyve](https://github.com/denzyve).

Original idea inspired by [kokim2022](https://github.com/kokim2022)