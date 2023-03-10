const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const index = tours.findIndex((item) => item.id === id);

  if (index <= -1 || index >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  let resultTours = [...tours];
  resultTours[index] = Object.assign(resultTours[index], req.body);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(resultTours),
    (err) => {
      if (err) console.log(err);
      res.status(200).json({
        status: 'success',
        data: {
          tour: resultTours[index],
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invaild ID',
    });
  }

  const updatedTours = tours.filter((t) => t.id !== tour.id);
  fs.writeFile(
    path.resolve(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(updatedTours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
