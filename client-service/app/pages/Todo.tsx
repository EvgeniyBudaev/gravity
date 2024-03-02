"use client";

import { type FC, useEffect, useState } from "react";

export const Todo: FC = () => {
  const [todo, setTodo] = useState<any>();

  const handleGetTodo = async () => {
    await fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => setTodo(json));
  };

  useEffect(() => {
    handleGetTodo();
  }, []);

  return (
    <>
      <h1>Hello World</h1>
      <div>{todo?.title}</div>
    </>
  );
};
