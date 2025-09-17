import React from 'react';
import ArticleCard from './components/ArticleCard';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';
import sampleArticles from './data/articles';

const Home = () => {
	return (
		<div className="app">
			<Header />

			<div className="grid">
				<main>
					<section className="main-list">
						{sampleArticles.slice(0, 6).map((a) => (
							<ArticleCard key={a.id} {...a} />
						))}
					</section>
				</main>

				<aside className="sidebar">
					<div className="featured">
						<h4>Editor's pick: Climate Summit Outcomes</h4>
						<p style={{ color: '#666' }}>
							Leaders gathered to discuss actionable plans aiming to reduce
							emissions and support vulnerable nations...
						</p>
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

			<Footer />
		</div>
	);
};

export default Home;
