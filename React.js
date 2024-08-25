import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';


function Header() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cars">Car List</Link></li>
      </ul>
    </nav>
  );
}


function Home() {
  return (
    <div>
      <h1>Welcome to Car Analytics</h1>
      <p>Select a car to see more details.</p>
    </div>
  );
}


function CarList() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem('cars'));
    if (storedCars) {
      setCars(storedCars);
    } else {
      fetch('/data.json')
        .then(response => response.json())
        .then(data => {
          setCars(data);
          localStorage.setItem('cars', JSON.stringify(data));
        });
    }
  }, []);

  return (
    <div>
      <h2>Car List</h2>
      <ul>
        {cars.map(car => (
          <li key={car.id}>
            <Link to={`/cars/${car.id}`}>
              {car.make} {car.model} ({car.year})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


function CarDetail({ match }) {
  const [car, setCar] = useState(null);

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem('cars'));
    if (storedCars) {
      const selectedCar = storedCars.find(c => c.id === parseInt(match.params.id));
      setCar(selectedCar);
    }
  }, [match.params.id]);

  if (!car) return <div>Loading...</div>;

  return (
    <div>
      <h2>{car.make} {car.model} ({car.year})</h2>
      <p>Mileage: {car.mileage} miles</p>
      <p>Price: ${car.price}</p>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/cars" exact component={CarList} />
        <Route path="/cars/:id" component={CarDetail} />
      </Switch>
    </Router>
  );
}

export default App;
