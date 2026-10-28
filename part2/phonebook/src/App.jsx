import axios from "axios";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const baseUrl = "http://localhost:3001/api/persons";

  useEffect(() => {
    console.log("effect");
    axios.get(baseUrl).then((response) => {
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
      };

      persons.some((person) => person.name === personObject.name)
        ? // here lets check if the user wants to update the number of an existing person and call the updateNumber function which will send put request
          updateNumber(personObject)
        : addNewPerson(personObject);

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
      axios.delete(`${baseUrl}/${id}`).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const updateNumber = (personObject) => {
    const person = persons.find((p) => p.name === personObject.name);
    if (
      window.confirm(
        `${person.name} is already added to phonebook, replace the old number with a new one?`,
      )
    ) {
      axios
        .put(`${baseUrl}/${person.id}`, personObject)
        .then((response) => {
          setPersons(
            persons.map((p) => (p.id === person.id ? response.data : p)),
          );
          // Add success notification here
          setMessageType("success");
          setMessage(`Updated ${person.name}'s number`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          setMessageType("error");

          setMessage(
            `Information of ${person.name} has already been removed from server`,
          );
          setTimeout(() => {
            setMessage(null);
          }, 5000);
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  const addNewPerson = (personObject) => {
    axios.post(baseUrl, personObject).then((response) => {
      setPersons(persons.concat(response.data));
    });

    setMessageType("success");
    setMessage(`Added ${personObject.name}`);
    setTimeout(() => {
      setMessage(null);
    }, 5000);

    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

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
