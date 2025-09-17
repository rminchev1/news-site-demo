import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ id, title, excerpt, content, author, date }) => {
  // Use full content when available, otherwise fall back to excerpt
  const source = content || excerpt || '';
  const preview = source.length > 150 ? source.slice(0, 150).trimEnd() + '…' : source;

  return (
    <article className="card">
      <div className="card-content">
        <h3 className="card-title">
          {title}
        </h3>
        <p className="card-excerpt">{preview}</p>
        <div className="card-meta">
          <span className="card-author">{author}</span>
          <span className="card-date">{date}</span>
        </div>
        <Link className="card-readmore" to={`/article/${id}`}>Read more →</Link>
      </div>
    </article>
  );
};

export default ArticleCard;
