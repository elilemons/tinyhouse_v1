import express from 'express';
import bodyParser from 'body-parser';
import { Listing,listings } from './listings';
import { Booking, bookings } from './bookings';

const app = express();
const port = 9000;

app.use(bodyParser.json());

// Listings
app.get('/listings', (_req, res) => {
  res.send(listings);
});

app.post('/delete-listing', (req, res) => {
  const id: string = req.body.id;

  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      return res.send(listings.splice(i, 1)[0]);
    }
  }

  return res.send('failed to deleted listing');
});

// Booking
app.post('/create-booking', (req, res) => {
  const id: string = req.body.id;
  const timestamp = req.body.timestamp || new Date().toLocaleString();

  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      const newBooking: Booking = {
        id: bookings.length.toString(),
        title: listings[i].title,
        image: listings[i].image,
        address: listings[i].address,
        timestamp
      };
      bookings.push(newBooking);
      listings[i].bookings.push(newBooking.id);

      return res.send(newBooking);
    }
  }

  res.send('OK');
});

app.get('/bookings', (_req, res) => {
  res.send(bookings);
});

// Favorites
app.get('/favorites', (_req, res) => {
  const favorites: Listing[] = listings.filter(listing => listing.favorite);
  res.send(favorites);
});

app.post('/favorite-listing', (req, res) => {
  const id = req.body.id;

  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      listings[i].favorite = true;
      return res.send('Favorited.');
    }
  }
});

app.listen(port);

console.log(`[app] : http://localhost:${port}`);
