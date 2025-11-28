import './Hero.css';
import {Cards} from './Cards';
const HERO_IMAGE ='public/backgroundNU.png';

export function Hero() {
  return (
    <div>
      <header className="hero">
        <div className="hero__overlay" />
        <img className="hero__image" src={HERO_IMAGE} alt="Nile University campus" />
        <div className="hero__content">
          <p className="hero__eyebrow">Central Hub</p>
          <h1>
            Central Hub for
            <br />
            NU Clubs and SU
          </h1>
          <p className="hero__subtitle">
            Manage events, submit requests, and collaborate efficiently.
          </p>
        </div>
        <div className="hero__cards">
          <Cards />
        </div>
      </header>
    </div>
    
  );
}


