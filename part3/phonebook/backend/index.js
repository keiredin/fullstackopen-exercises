require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/phonebooks");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
// app.use(morgan("tiny"));

morgan.token("body", (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      console.log(`Deleted person with id ${id}`);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// const generateId = () => {
//   const maxId = 1000000000;
//   return String(Math.floor(Math.random() * maxId));
// };

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }
  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        return res.status(400).json({ error: "Name must be unique" });
      }

      const newPerson = new Person({
        name,
        number,
      });
      newPerson
        .save()
        .then((savedPerson) => {
          res.json(savedPerson);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const info = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `;
      res.send(info);
    })
    .catch((error) => next(error));
});

// Middleware for handling unknown endpoint
const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Middleware for handling errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
