const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// 221457
// prod_commerce

// mongodb code here


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://prod_commerce:01305801580@cluster0.mmdewqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const Product = client.db("prod_commerce").collection("products");

    app.get('/products', async (req, res) => {
        const { category, brand, minPrice, maxPrice, search, page = 1, limit = 10, order,sort } = req.query;
        const products = await Product.aggregate([
            {
              $match: {
                Category: category, // Filter by category
                brand: brand, // Filter by brand name
                price: { $gte: minPrice, $lte: maxPrice } // Filter by price range
              }
            },
            {
                $sort: { [sort]: order === 'desc' ? -1 : 1 }// Sort by price in descending order (high to low)
            },
            {
              $skip: (page - 1) * limit // Skip documents for pagination
            },
            {
              $limit: limit // Limit the number of documents for pagination
            }
          ]).toArray();

        // let filter = {};

        // if (category) filter.category = category;
        // if (brand) filter.brand = brand;
        // if (minPrice || maxPrice) {
        //     filter.price = {};
        //     if (minPrice) filter.price.$gte = parseInt(minPrice);
        //     if (maxPrice) filter.price.$lte = parseint(maxPrice);
        // }
        // if (search) filter.name = { $regex: search, $options: 'i' };

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        // const skip = (pageNumber - 1) * pageSize;

        // let sortOrder = {};
        // if (sort === 'priceLowToHigh') sortOrder.price = 1;        // Ascending
        // if (sort === 'priceHighToLow') sortOrder.price = -1;   // Descending
        // if (sort === 'newest') sortOrder.createdAt = -1;       // Newest first
        // if (sort === 'oldest') sortOrder.createdAt = 1;        // Oldest first


        //     const products = await Product.find(filter)
        //         .skip(skip)
        //         .limit(pageSize)
        //         .sort(sortOrder).toArray()

            const totalProducts = await Product.countDocuments();
            const totalPages = Math.ceil(totalProducts / pageSize);
            res.send(products)
            // res.send({products, totalProducts,totalPages,currentPage: pageNumber})
            // res.json({
            //     products,
            //     totalProducts,
            //     totalPages,
            //     currentPage: pageNumber,
            // });

    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("prod_Commerce is running HERE!");
  });
  app.listen(port, (req, res) => {
    console.log(`server running on port ${port}`);
  });
