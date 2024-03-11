<script>
	import Header from './Header.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import Footer from './Footer.svelte';
	import './styles.css';
	import '../app.css';

	/** @type {import('./$types').PageData} */
	export let data;

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="app">
		<Header gdprEnabled={data.gdprEnabled} />

		<main>
			<slot />
		</main>

		<Footer currentYear={data.currentYear} />
	</div>
</QueryClientProvider>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
