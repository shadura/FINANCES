# FIN_BUT Project

A Nuxt 3 application with Supabase integration.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) and [Supabase documentation](https://supabase.com/docs) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Supabase Setup

1. Create a Supabase account at [https://supabase.com/](https://supabase.com/)
2. Create a new project in Supabase
3. Run the setup script to create your .env file:

```bash
./setup-env.sh
```

4. Update the .env file with your Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon/public key
   - `SUPABASE_SERVICE_KEY`: Your Supabase service key (if needed)

## Using Supabase in your Nuxt 3 Application

The Supabase client is available in your components via composables:

```vue
<script setup>
// Access the Supabase client
const client = useSupabaseClient()

// Access the current user
const user = useSupabaseUser()

// Example: Query data
async function fetchData() {
  const { data, error } = await client
    .from('your_table')
    .select('*')
  
  if (error) console.error('Error fetching data:', error)
  return data
}
</script>
```

See the `components/SupabaseExample.vue` file for a working example of authentication.
