/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Gallery from './pages/Gallery';
import ArticleDetail from './pages/ArticleDetail';
import ContentDetail from './pages/ContentDetail';
import AskQuestion from './pages/AskQuestion';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import MyQuestions from './pages/MyQuestions';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="library" element={<Library />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="article/:id" element={<ArticleDetail />} />
          <Route path="content/:id" element={<ContentDetail />} />
          <Route path="ask" element={<AskQuestion />} />
          <Route path="admin" element={<Admin />} />
          <Route path="auth" element={<Auth />} />
          <Route path="my-questions" element={<MyQuestions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
