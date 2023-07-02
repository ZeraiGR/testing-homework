import { rest } from 'msw';

export const handlers = [
  rest.get("http://localhost/hw/store/api/products", (req, res, ctx) => {
      return res(
          ctx.status(200),
          ctx.json([
              { "id": 0, "name": "Unbranded Shoes", "price": 70 },
              { "id": 1, "name": "Incredible Pizza", "price": 532 },
              { "id": 2, "name": "Rustic Car", "price": 313 },
              { "id": 4, "name": "Generic Pizza", "price": 665 }
          ])
      )
  }),
  rest.get("http://localhost/hw/store/api/products/0", (req, res, ctx) => {
      return res(
          ctx.status(200),
          ctx.json({
              "id": 0,
              "name": "Unbranded Shoes",
              "description": "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
              "price": 70,
              "color": "lime",
              "material": "Fresh"
          })
      )
  }),
];