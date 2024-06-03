import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Error from './Pages/Error';
import Feed from './Pages/Feed';
import Profile from './Pages/Profile';
import Chat from './Pages/Chat';
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/feed" element={<Feed />} />

          <Route path="/profile/:message" element={<Profile />} />

          <Route path="/chat" element={<Chat />} />

          <Route path="/chat/:username" element={<Chat />} />

          <Route path="*" element={<Error />} />

          <Route path="/error" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
