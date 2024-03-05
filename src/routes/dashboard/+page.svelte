<script>
	import ConnectForm from "../../components/ConnectForm.svelte";
	import Cookies from "js-cookie";
	import ConnectDialog from "../../components/ConnectDialog.svelte";

	let serverAddress = Cookies.get('serverAddr');
	let serverPort =     Cookies.get('serverPort');

	function connectFormNeeded() {
		if (serverAddress === 'undefined' || serverPort === 'undefined') {
			return true;
		} else {
			return false;
		}
	}
</script>

<svelte:head>
	<title>Dashboard - PeekUI</title>
	<meta name="description" content="PeekUI" />
</svelte:head>


<section class="p-4 bg-gray-50 rounded-lg flex flex-col w-full">

<!--	{#if !connectFormNeeded()}-->
<!--		<ConnectForm />-->
<!--	{/if}-->

	<ConnectDialog />

</section>

<style>
</style>
