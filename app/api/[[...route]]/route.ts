import { z } from "zod";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app
  .get("/hello", (c) => {
    return c.json({
      message: "Hello Next.js!",
    });
  })
  .post("/envio", async (c) => {
    const { nome, sobrenome, idade } = await c.req.json();
    const novoUsuario = {
      nome,
      sobrenome,
      idade,
    };

    return c.json(novoUsuario);
  });

export const GET = handle(app);
export const POST = handle(app);
