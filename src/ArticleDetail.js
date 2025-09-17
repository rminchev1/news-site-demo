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
        <main className="article-main">
          <p>Article not found.</p>
          <Link to="/">Back</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const paragraphs = article.content.split(/\n\n+/).map((p, i) => p.trim()).filter(Boolean);

  return (
    <div className="app">
      <Header />
      <main className="article-main">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">{article.author} · {article.date}</div>
        <div className="article-body">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
        <Link to="/">← Back to home</Link>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
