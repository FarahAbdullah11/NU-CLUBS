import './Cards.css';

interface CardData {
  title: string;
  description: string;
}

const cardsData: CardData[] = [
  {
    title: 'Submit a request',
    description: 'Create event and resource requests easily'
  },
  {
    title: 'View events calendar',
    description: 'See all upcoming club events in one place'
  },
  {
    title: 'View my requests',
    description: 'Check the status of your submitted requests'
  }
];

export function Cards() {
  return (
    <div className="cards-container">
      {cardsData.map((card, index) => (
        <div key={index} className="card">
          <h3 className="card__title">{card.title}</h3>
          <p className="card__description">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

