import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import express from "express";

// Construct a schema, using GraphQL schema language
const restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

const schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

const root = {

  restaurant: ({ id }) => {
    const index = restaurants.findIndex(x => x.id === id);
    if (index < 0) { throw new Error('restaurant doesn\'t exist'); }
    return restaurants[index];
  },

  restaurants: () => restaurants,

  setrestaurant: ({ input: { name, description } }) => {
    const id = restaurants[restaurants.length - 1].id + 1;
    restaurants.push({ id, name, description });
    return { id, name, description };
  },

  deleterestaurant: ({ id }) => {
    const index = restaurants.findIndex(x => x.id === id);
    restaurants.splice(index, 1);
    return { ok: Boolean(index >= 0) };
  },

  editrestaurant: ({ id, ...restaurant }) => {
    const index = restaurants.findIndex(x => x.id == id);
    if (index < 0) {
      throw new Error("restaurant doesn't exist");
    }
    restaurants[index] = {
      ...restaurants[index],
      ...restaurant,
    };
    return restaurants[index];
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
const port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

export default root;
