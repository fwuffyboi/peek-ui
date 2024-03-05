<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const hash = window.location.hash;
		if (hash) {
			const element = document.querySelector(hash);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
</script>

<svelte:head>
	<title>Help - Peek</title>
	<meta name="description" content="Help for Peek" />
</svelte:head>

<div class="flex flex-col gap-2">
	<div class="text-3xl font-bold ">
		<h1>Help</h1>
		<hr class="border-black">
	</div>

	<div id="getting-started">
		<h1 class="font-extrabold text-1xl">Getting started</h1>
		<p>
			To get started with Peek, you need to connect to a Peek server. You can do this by clicking the "Connect" button in the top right corner of the screen.
		</p>
		<p>
			You will need to enter the address of the Peek server you want to connect to. This will be in the form of a URL, such as <code>https://peek.example.com</code>.
		</p>
		<p>
			You may also need to enter a username and password to connect to the server. If you do not have these details, you will need to contact the administrator of the Peek server.
		</p>
	</div>

	<div id="connecting">
		<h1 class="font-extrabold text-1xl">Connecting to a Peek server</h1>
		<p>
			Once you have entered the address of the Peek server you want to connect to, click the "Connect" button. Peek will then attempt to connect to the server.
		</p>
		<p>
			If the connection is successful, you will be taken to the main screen of Peek, where you can view and manage your files and folders.
		</p>
		<p>
			If the connection is not successful, you will see an error message explaining what went wrong. You may need to check the address of the server, or your username and password, and try again.
		</p>
	</div>

</div>
