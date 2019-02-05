import React from 'react';

import logoImg from '../images/vroom-logo.svg';


export default () => (
  <section className="section">
    <div className="container">
      <h1 className="is-size-1">About <strong className="has-text-link">vroom</strong></h1>

      <div className="content">
        <h1 align="center">
          <br />
          <a href="#"><img src={logoImg} alt="VRoom" width={400} /></a>
          <br />
        </h1>
        <h4 className="has-text-centered">
          A platform for people sleeping in their vehicles to find overnight parking
          <span role="img" aria-label="van"> 🚍</span>
        </h4>
        <p align="center">
          <a href="#the-issue">The Issue</a> •&nbsp;
          <a href="#the-audience">The Audience</a> •&nbsp;
          <a href="#our-solution">Our Solution</a> •&nbsp;
          <a href="#technologies">Technologies</a>
        </p>
        <h2 id="the-issue">The Issue</h2>
        <ul>
          <li>30% of the homeless population in Santa Cruz resides in their vehicles. </li>
          <li>Finding a place to park your car and sleep in it can be hard.</li>
          <li>Most of public parking are patrolled by local police.</li>
          <li>Many people are offering their drive-ways for rent on Craigslist,
            given the housing crisis in the county.
          </li>
          <li>Government led programs are scarce and do not fit the demand.</li>
        </ul>
        <h2 id="the-audience">The Audience</h2>
        <ul>
          <li>Our app is aimed to anyone sleeping in their car or van of preference.</li>
          <li>Our app is also used by those who have driveways, parking lots,
            and other space that are not being used.
          </li>
        </ul>
        <h2 id="our-solution">Our Solution</h2>
        <ul>
          <li>Our goal is to make an app to connect people that have an extra parking space
            they would like to offer with people that need a safe place to park their vehicle
            overnight for a low cost.
          </li>
          <li>By having a centralized app, those residing in their vehicles can easily look
            for a parking spot that they know they will be safe at for any duration that
            spaces are available.
          </li>
        </ul>
        <h2 id="technologies">Technologies</h2>
        <p>This application uses the following technologies:</p>
        <ul>
          <li>React</li>
          <li>Bulma CSS</li>
          <li>FireBase's Firestore</li>
          <li>MapBox</li>
          <li>Google Streetview</li>
        </ul>
      </div>
    </div>
  </section>
);
