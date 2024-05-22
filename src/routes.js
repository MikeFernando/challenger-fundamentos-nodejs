import { randomUUID } from "node:crypto";

import { Database } from "./database.js";
import { isUUID } from "./utils/uuidValidate.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              name: search,
              email: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (req.body) {
        const { title, description, completed_at } = req.body;

        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at,
          created_at: new Date(),
          updated_at: new Date(),
        };

        database.insert("tasks", task);

        return res.writeHead(201).end();
      }

      return res.writeHead(404).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description, completed_at } = req.body;

      if (!isUUID(id)) {
        return res.writeHead(404).end("Task Not Exist");
      }

      const data = {
        id,
        title,
        description,
        completed_at,
        updated_at: new Date(),
      };

      database.update("tasks", id, data);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(201).end();
    },
  },
];
