import "reflect-metadata";
import "./db/db";
import express, {Express, Request, Response } from "express";
import { router } from "./routes";


const app: Express = express()
app.use(express.json({ limit: "50mb" }));
app.use(router)
app.listen(3333, () => console.log("Server is running!"));
