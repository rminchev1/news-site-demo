import React from 'react';
import ArticleCard from './components/ArticleCard';
import './Home.css';

const sampleArticles = [
  {
    id: 1,
    title: 'Global Markets Rally as Tech Stocks Rebound',
    excerpt: 'Markets showed renewed optimism today as major tech companies reported stronger-than-expected earnings, lifting indexes across the board...',
    author: 'Jane Doe',
    date: 'Sep 17, 2025',
    image: 'https://source.unsplash.com/random/800x600?nature,1'
  },
  {
    id: 2,
    title: 'Breakthrough in Renewable Energy Storage',
    excerpt: 'Researchers announced a new battery design that could dramatically increase storage efficiency and lower costs for solar and wind power...',
    author: 'John Smith',
    date: 'Sep 16, 2025',
    image: 'https://source.unsplash.com/random/800x600?technology,2'
  },
  {
    id: 3,
    title: 'City Council Approves Major Transit Plan',
    excerpt: "The city council voted to approve a $2 billion transit expansion that aims to reduce commute times and improve service to underserved neighborhoods...",
    author: 'Alex Lee',
    date: 'Sep 15, 2025',
    image: 'https://source.unsplash.com/random/800x600?city,3'
  },
  {
    id: 4,
    title: 'Local Startup Raises Series A to Expand Globally',
    excerpt: 'A local startup focused on developer tools announced a successful Series A round led by prominent investors, planning to open offices overseas...',
    author: 'Priya Patel',
    date: 'Sep 14, 2025',
    image: 'https://source.unsplash.com/random/800x600?startup,4'
  }
];

const Home = () => {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div style={{width:40,height:40,background:'#282c34',borderRadius:8}}></div>
          <div className="brand">poool</div>
        </div>
        <nav className="nav">Home · World · Business · Technology · Culture</nav>
      </header>

      <div className="grid">
        <main>
          <section className="main-list">
            {sampleArticles.map(a => (
              <ArticleCard key={a.id} {...a} />
            ))}
          </section>
        </main>

        <aside className="sidebar">
          <div className="featured">
            <img src="https://source.unsplash.com/random/800x600?news,5" alt="featured" />
            <h4>Editor's pick: Climate Summit Outcomes</h4>
            <p style={{color:'#666'}}>Leaders gathered to discuss actionable plans aiming to reduce emissions and support vulnerable nations...</p>
          </div>

          <div>
            <h5>Most Read</h5>
            <ol>
              <li>How to prepare your home for winter</li>
              <li>Top 10 productivity tips for remote teams</li>
              <li>New AI tools changing the way we work</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
