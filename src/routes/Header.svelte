<script>
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';

	import { Toast, Button, Select, Label } from 'flowbite-svelte';
	import Cookies from 'js-cookie'

	export let gdprEnabled;

	// for closing the gdpr toast
	let gdprOpen = true;

</script>

<header class="flex flex-row w-full pt-1 pr-1 pl-1">
	<h1 class="font-extrabold text-4xl">PeekUI</h1>

	<div class="pl-1 flex flex-auto">
		<div class="w-8">
			<img src={logo} alt="The Peek-UI logo." />
		</div>
		<div class="w-10">
			<a href="https://github.com/fwuffyboi/peek-ui">
				<img src={github} alt="The Peek-UI Github." />
			</a>
		</div>
	</div>

	<div class="flex space-x-4 mb-6 justify-items-end">
		<Label defaultClass="flex flex-row items-center justify-center gap-2">
			Language
			<Select items={[{value: "en", name: "English"}]} placeholder="English" />
		</Label>

		{#if gdprOpen && !gdprEnabled}
			<Toast dismissable={false} bind:gdprOpen position="bottom-right">
				<span class="font-semibold text-gray-900 dark:text-white">Cookies! om nom nom</span>
				<div class="mt-3">
					<div class="mb-2 text-sm font-normal">
						We use anonymized statistics to help improve this site.
						Please note, this site will use cookies for essential purposes regardless of your choice.
						Learn more <a href="/help#cookies" class="text-primary-700 underline">here</a>.
					</div>
					<div class="grid grid-cols-2 gap-2">
						<Button on:click={() => {
							Cookies.set("gdpr", "true", {expires: 365, sameSite: "strict"});
							gdprOpen = false;
						}} size="xs" class="w-full">Sure!</Button>
						<Button on:click={() => {
							Cookies.set("gdpr", "false", {expires: 365, sameSite: "strict"});
							gdprOpen = false;
						}} size="xs" class="w-full" color="dark">Nope!</Button>
					</div>
				</div>
			</Toast>
		{/if}

	</div>

</header>

<style>
</style>
