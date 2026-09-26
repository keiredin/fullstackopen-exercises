import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const addPerson = () => {
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      };
      persons.some((person) => person.name === personObject.name)
        ? alert(`${newName} is already added to phonebook`)
        : setPersons(persons.concat(personObject));

      setNewName("");
      setNewNumber("");
    };

    newName === "" || newNumber === ""
      ? alert("Please fill in both name and number")
      : addPerson();
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with...{" "}
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />{" "}
      </div>

      <h2>add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {filteredPersons.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
