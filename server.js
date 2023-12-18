import app from "./app.js";

import createTables from "./database/createTables.js";
import seedCountries from "./seeder/countries.js";
import dropTables from "./database/dropTables.js";
import seedUsers from "./seeder/users.js";
import seedProducts from "./seeder/products.js";

import consola from 'consola';

const port = process.env.PORT || 3000;

// dropTables();
// createTables();
// seedCountries();
// seedUsers();
// seedProducts();


app.listen(port, () => {
  consola.success(`Api listening on port ${port}!`);
});
