import app from "./app.js";
import createTables from "./database/createTables.js";
import seedCountries from "./seeder/countries.js";
import seedSellers from "./seeder/sellers.js";
import seedUsers from "./seeder/users.js";
import seedProducts from "./seeder/products.js";

import consola from 'consola';

const port = process.env.PORT || 3000;

// createTables();
// seedCountries();
// seedSellers();
// seedUsers();
// seedProducts();

app.listen(port, () => {
  consola.success(`Api listening on port ${port}!`);
});
