import React from 'react';
import LandingRegistration from './LandingRegistration';

const Landing = () => {
  return (
    <div className="Landing">
      <main>
        <div className="banner">
          <div className="container">
            <div className="banner__headline">
              <h1 id="banner-lead">Meet your next favourite book.</h1>
            </div>
            <LandingRegistration />
          </div>
        </div>

        <div className="page-container">
          <section className="highlights-section">
            <div className="row" id="row">
              <div className="highlight">
                <h3>Deciding what to read next?</h3>
                <p>
                  You’re in the right place. Tell us what titles or genres
                  you’ve enjoyed in the past, and we’ll give you surprisingly
                  insightful recommendations.
                </p>
              </div>
              <div className="highlight">
                <h3>What are your friends reading?</h3>
                <p>
                  Chances are your friends are discussing their favorite (and
                  least favorite) books on bookshelf.
                </p>
              </div>
              <div className="highlight">
                <h3>Are you an author or a publisher?</h3>
                <p>
                  Gain access to a massive audience of bookworms like yourself.
                  bookshelf is a great place to promote your books.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Landing;
