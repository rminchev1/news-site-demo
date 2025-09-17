import React from 'react';

const ArticleCard = ({ title, excerpt, author, date }) => {
  return (
    <article className="card">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
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
