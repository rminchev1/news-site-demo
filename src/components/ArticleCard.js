import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ id, title, excerpt, author, date }) => {
  return (
    <article className="card">
      <div className="card-content">
        <h3 className="card-title">
          <Link to={`/article/${id}`}>{title}</Link>
        </h3>
        <p className="card-excerpt">{excerpt}</p>
        <div className="card-meta">
          <span className="card-author">{author}</span>
          <span className="card-date">{date}</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
