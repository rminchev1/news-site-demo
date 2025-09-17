import React from 'react';
import { useParams, Link } from 'react-router-dom';
import articles from './data/articles';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles.find((a) => String(a.id) === id);

  if (!article) {
    return (
      <div className="app">
        <Header />
        <main style={{ padding: 24 }}>
          <p>Article not found.</p>
          <Link to="/">Back</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main style={{ padding: 24 }}>
        <h1>{article.title}</h1>
        <div style={{ color: '#888', marginBottom: 12 }}>
          {article.author} · {article.date}
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.6 }}>{article.content}</p>
        <Link to="/">← Back to home</Link>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
