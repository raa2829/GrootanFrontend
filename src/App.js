import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function CorrespondingElement(key, value) {
  let ipname = value.name ? value.name : key;
  if (value.type === "title") return <div className="title">{key}</div>;
  if (value.type === "subtitle") return <div className="subtitle">{key}</div>;
  if (value.type === "range") {
    let minvalue = value.min !== undefined ? value.min : 0;
    let maxvalue = value.max !== undefined ? value.max : 10000;
    return (
      <div className="input_holder">
        <label>{key}</label>
        <input name={ipname} min={minvalue} max={maxvalue} type="range" />
      </div>
    );
  }
  if (value.type === "select") {
    if (value.options)
      return (
        <div className="input_holder">
          <label>{key}</label>
          <select name={ipname}>
            {value.options.map((op) => (
              <option>{op}</option>
            ))}
            ;
          </select>
        </div>
      );
  }
  if (value.type === "number")
    return (
      <div className="input_holder">
        <label>{key}</label>
        <input name={ipname} type="number" />
      </div>
    );
  if (value.type === "date")
    return (
      <div className="input_holder">
        <label>{key}</label>
        <input name={ipname} type="date" />
      </div>
    );
  if (value.type === "color") {
    let color = value.color !== undefined ? value.color : "#000";
    return (
      <div className="input_holder">
        <label>{key}</label>
        <input name={ipname} type="text" value={color} />
        <div
          style={{ backgroundColor: color, width: "50px", height: "100%" }}
        ></div>
      </div>
    );
  }
  if (value.type === "file")
    return (
      <div className="input_holder">
        <label>{key}</label>
        <input
          name={ipname}
          type="file"
          accept={`${value.extension ? "." + value.extension : ""}`}
        />
      </div>
    );

  return (
    <div className="input_holder">
      <label>{key}</label>
      <input name={ipname} type="text" />
    </div>
  );
}

function App() {
  const [jsonInput, changejsonInput] = useState({});
  const [iserror, setError] = useState(false);
  const handlechange = (ev) => {
    try {
      let newJson = JSON.parse(ev.target.value);
      changejsonInput(newJson);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };
  const handlesubmit = (ev) => {
    let myFormData = {};
    let inputs = ev.target.querySelectorAll("input");
    inputs.forEach((input) => (myFormData[input.name] = input.value));
    ev.preventDefault();
    fetch("http://localhost:8080/add", {
      body: JSON.stringify(myFormData),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div className="App">
      <div className="Navbar">
        <div className="Navbar_brand">Project Raa</div>
      </div>
      <div className="Container">
        <div className="Output">
          {!iserror && (
            <form onSubmit={handlesubmit}>
              {Object.keys(jsonInput).map((key) => {
                return CorrespondingElement(key, jsonInput[key]);
              })}
              {Object.keys(jsonInput).length > 0 && (
                <button type="submit">Submit</button>
              )}
            </form>
          )}
          {iserror && <div className="error">Invalid JSON input</div>}
        </div>
        <div className="Input">
          <textarea
            onChange={handlechange}
            placeholder="Your json input"
          >{`{}`}</textarea>
        </div>
      </div>
    </div>
  );
}

export default App;
