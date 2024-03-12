<script>
	import { Modal, Button, Input, Label, Checkbox } from 'flowbite-svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { get } from 'svelte/store';
	import { persisted } from 'svelte-persisted-store';

	export const preferences = persisted('preferences', {
		serverIP: '',
		serverPort: '',
		useHTTPS: true
	});

	const useHTTPSToString = $preferences.useHTTPS ? 'https://' : 'http://';

	$: url = `${useHTTPSToString}${$preferences.serverIP}${$preferences.serverPort ? `:${$preferences.serverPort}` : ''}/api/heartbeat`;

	const heartbeatQuery = async (urlData) => {
		const response = await fetch(urlData);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	};

	const query = createQuery({
		queryKey: ['heartbeat', url],
		queryFn: async () => await heartbeatQuery(url),
		enabled: false,
		refetch: true,
		retry: 0
	});

	let isModalOpen = true;
</script>

<svelte:head>
	<title>Dashboard - Peek</title>
	<meta name="description" content="Connect and view the statistics of a Peek server" />
</svelte:head>

<Modal title="Connect To Server" bind:open={isModalOpen} action="/dashboard" class="h-full w-full">
	<div class="mb-6">
		<Label for="ip-input" class="block mb-2">Domain/IP</Label>
		<Input id="ip-input" bind:value={$preferences.serverIP} size="lg" placeholder="127.0.0.1" />
	</div>
	<div class="mb-6">
		<Label for="port-input" class="block mb-2">Port</Label>
		<Input id="port-input" bind:value={$preferences.serverPort} size="lg" placeholder="42649" />
	</div>
	<div class="mb-6">
		<Checkbox
			id="https-input"
			on:change={(val) =>
				preferences.set({
					serverIP: $preferences.serverIP,
					serverPort: $preferences.serverPort,
					useHTTPS: val.target.checked
				})}
			checked>This server uses HTTPS</Checkbox
		>
	</div>

	<div class="">
		<Button shadow color="dark" href="/help#connecting">Help!</Button>
		<Button
			shadow
			color="blue"
			on:click={() => {
				console.log('foo');
				$query.refetch();
			}}>Connect!</Button
		>
	</div>
	{#if $query.isFetching}
		<p class="animate-pulse italic">Connecting...</p>
	{/if}
	{#if $query.isError}
		<p class="text-red-600 italic">Error!: {$query.error.message}</p>
	{/if}
	{#if $query.isSuccess && !$query.isError}
		<p class="text-green-600 italic">You're connected!</p>
	{/if}
</Modal>
