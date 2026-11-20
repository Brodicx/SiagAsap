# Backend local development

The backend uses MySQL. A database server must be running before reports and health-post data can be loaded or saved.

## Set up a local database

1. Start a local MySQL or MariaDB server.
2. From the `backend` directory, create the database and tables:

   ```powershell
   Get-Content .\schema.sql -Raw | mysql.exe -u root -p
   ```

   If your local MySQL account has no password, omit `-p`.
3. Configure the environment file with your local MySQL account. If `.env` does not exist yet:

   ```powershell
   Copy-Item .env.example .env
   ```

   If `.env` already exists, edit its `DB_*` values instead of overwriting it. Keep `.env` local. It is ignored by Git.
4. Start the API from the `backend` directory:

   ```powershell
   npm run dev
   ```

The default local database name is `siagasap`, with MySQL on `127.0.0.1:3306`. Change the `DB_*` values in `.env` if your local server uses different settings. The example password is a placeholder, not a real credential.

The schema creates empty tables. Add real posko records separately; no sample reports or contact details are inserted.

When a user searches a city or shares their location, the API searches for OpenStreetMap hospitals within 20 km of that coordinate using Nominatim. Search runs only after a user action, caches results for 15 minutes, and queues requests at no more than one per second to follow [Nominatim's public usage policy](https://operations.osmfoundation.org/policies/nominatim/). Nominatim returns its best matches, not a complete facility directory, so results may be incomplete. Manually entered posko data remains separate. The UI links to OpenStreetMap and displays its required attribution.

Set `NOMINATIM_URL` in the backend environment to switch to another compatible Nominatim service without changing application code.
