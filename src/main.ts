import express from "express";

const port = process.env.PORT || 3030;

const server = express();

server.use(express.json());

server.get("", (req, res) =>
  res.json({
    message: "Hello World",
    status: 200,
  }),
);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
