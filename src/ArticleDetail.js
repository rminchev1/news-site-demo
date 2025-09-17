import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import articles from './data/articles';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';
import {
  AccessContext,
  RestrictedContent,
  Paywall,
  Pixel,
} from '@poool/react-access';


const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles.find((a) => String(a.id) === id);
  const contentRef = useRef(null);

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

      {/* poool integration: wrap content with AccessContext and use RestrictedContent */}
      <AccessContext
        appId="3TCCE-QEOD2-1FBEY-BDMKQ"
        config={{ cookies_enabled: true }}
        withAudit={true}
      >
        <main className="article-main">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">{article.author} · {article.date}</div>

          {/* RestrictedContent needs a ref so Paywall can anchor to it */}
          <RestrictedContent ref={contentRef}>
            <div className="article-body">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </RestrictedContent>

          {/* place the paywall component and pixel tracking */}
          <Paywall contentRef={contentRef} />
          <Pixel type="page-view" data={{ type: 'premium', articleId: article.id }} />

          <Link to="/">← Back to home</Link>
        </main>
      </AccessContext>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
