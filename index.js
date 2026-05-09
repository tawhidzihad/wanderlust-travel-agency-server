const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		await client.connect();

		const db = client.db("wanderlust-travel");
		const destinationCollection = db.collection("destinations");

		app.get("/destination", async (req, res) => {
			const result = await destinationCollection.find().toArray();
			res.json(result);
		});

		app.get("/destination/:id", async (req, res) => {
			const { id } = req.params;
			const result = await destinationCollection.findOne({
				_id: new ObjectId(id),
			});

			res.json(result);
		});

		app.patch("/destination/:id", async (req, res) => {
			const { id } = req.params;
			const updatedData = req.body;

			const result = await destinationCollection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: updatedData },
			);

			res.json(result);
		});

		app.post("/destination", async (req, res) => {
			const destinationData = req.body;
			const result =
				await destinationCollection.insertOne(destinationData);
			res.json(result);
		});

		app.delete("/destination/:id", async (req, res) => {
			const { id } = req.params;
			const result = await destinationCollection.deleteOne({
				_id: new ObjectId(id),
			});

			res.json(result);
		});

		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!",
		);
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`Server running at ${port} port`);
});
