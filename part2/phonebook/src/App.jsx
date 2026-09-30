import axios from "axios";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const addPerson = () => {
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };

      persons.some((person) => person.name === personObject.name)
        ? // here lets check if the user wants to update the number of an existing person and call the updateNumber function which will send put request
          updateNumber(personObject)
        : setPersons(persons.concat(personObject));

      setNewName("");
      setNewNumber("");
    };

    newName === "" || newNumber === ""
      ? alert("Please fill in both name and number")
      : addPerson();
  };

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      axios.delete(`http://localhost:3001/persons/${id}`).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const updateNumber = (personObject) => {
    const person = persons.find((p) => p.name === personObject.name);
    if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
      axios
        .put(`http://localhost:3001/persons/${person.id}`, personObject)
        .then((response) => {
          setPersons(
            persons.map((p) => (p.id === person.id ? response.data : p))
          );
        });
    }
  };
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filter={filter}
        handleFilterChange={(e) => setFilter(e.target.value)}
      />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
