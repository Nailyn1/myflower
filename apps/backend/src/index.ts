import express from "express";
import dotenv from "dotenv";
import { CreatePlantDTO, Plant } from "@myflower/shared";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// временное in-memory хранилище для примера
let plants: Plant[] = [];

app.get("/health", (req, res) => res.json({ status: "YES" }));

app.get("/plants", (req, res) => {
  res.json(plants);
});

app.post("/plants", (req, res) => {
  const dto = req.body as CreatePlantDTO;
  const newPlant: Plant = {
    id: String(Date.now()),
    name: dto.name,
    description: dto.description,
    price: dto.price,
    imageUrl: dto.imageUrl,
    isAvailable: true,
  };
  plants.push(newPlant);
  res.status(201).json(newPlant);
});

app.listen(PORT, () => {
  console.log(
    `Backend running on port ${PORT} There are we. There is another changed!`
  );
});
