import express from 'express';
import scraper from './modules/scrapers.js';

const app = express();

app.listen(8090, () => {
  console.log('Server listening on port 8090');
});

app.get('/getarticles/:id', async (req, res) => {
  const search = req.params.id;

  try {
    //const data = await plasticstoday_scraper(search);
    const data =  await scraper(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping data.' });
  }
});


