const Header = (props) => <h1>{props.course}</h1>;
const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = (props) => {
  const totalExercises = props.parts.reduce(
    (sum, curr) => sum + curr.exercises,
    0,
  );
  return <h4>total of {totalExercises} exercises </h4>;
};

const Content = (props) => (
  <div>
    <Header course={props.name} />
    {props.parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
    <Total parts={props.parts} />
  </div>
);

export default Content;
