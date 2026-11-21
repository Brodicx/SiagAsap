# Backend local development

The backend uses PostgreSQL. Set `DATABASE_URL` to a PostgreSQL connection string before starting the API.

## Set up the database

1. Create or select a PostgreSQL database.
2. Run `schema.sql` in the database provider's SQL editor. It creates the application tables and indexes if they do not exist. It does not insert sample reports or contact details.
3. If `.env` does not exist yet, copy the example and replace its placeholder connection string:

   ```powershell
   Copy-Item .env.example .env
   ```

   Keep `.env` local. Do not commit the connection string to Git.
4. Start the API from the `backend` directory:

   ```powershell
   npm run dev
   ```

When a user searches a city or shares their location, the API searches for OpenStreetMap hospitals within 20 km of that coordinate using Nominatim. Search runs only after a user action, caches results for 15 minutes, and queues requests at no more than one per second to follow [Nominatim's public usage policy](https://operations.osmfoundation.org/policies/nominatim/). Nominatim returns its best matches, not a complete facility directory, so results may be incomplete. Manually entered posko data remains separate. The UI links to OpenStreetMap and displays its required attribution.

Set `NOMINATIM_URL` in the backend environment to switch to another compatible Nominatim service without changing application code.
