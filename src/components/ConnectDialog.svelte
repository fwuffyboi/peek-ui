<script>
    import { Modal, Button, Input, Label, Checkbox} from "flowbite-svelte"
    import { redirect } from '@sveltejs/kit';
    import Cookies from 'js-cookie';

    // get the cookies and parse them to get connection info
    let siteCookies = Cookies.get();
    let serverIPCookie = siteCookies['serverIP'];
    let serverPortCookie = siteCookies['serverPort'];
    let useHTTPSCookie = siteCookies['useHTTPS'];

    // if set, use the cookies and connect to the server
    if (serverIPCookie !== undefined && serverPortCookie !== undefined && useHTTPSCookie !== undefined) {
        serverIP = serverIPCookie;
        serverPort = serverPortCookie;
        useHTTPS = useHTTPSCookie === 't';
        handleSubmit(new Event('submit'));
    }

    let open = true

    let serverIP = '127.0.0.1';
    let serverPort = '42649';
    let useHTTPS = false;

    let connectionError = false;
    let errorMsg = '';
    let connecting = false;
    let success = false;

    // TODO: the checkbox for https isn't working
    function handleSubmit(event) {
        event.preventDefault();

        // set the right flags
        connecting = true;
        success = false;
        connectionError = false;
        errorMsg = '';

        // make a request to the server
        if (serverIP === '' || serverPort === '') {
            connectionError = true;
            errorMsg = 'Please enter a server IP and port';
            connecting = false;
            success = false;
            return;
        }

        let url = `${serverIP}:${serverPort}/api/heartbeat/`;
        if (useHTTPS) {
            url = `https://${url}`;
        } else {
            url = `http://${url}`;
        }

        console.log("ConnectForm submitted: ", serverIP, serverPort, useHTTPS, url);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    connectionError = true;
                    errorMsg = response.statusText;
                    connecting = false;
                    success = false;

                    if (response.status === 429) {
                        errorMsg = 'Too many requests!';
                    } else {
                        errorMsg = response.statusText;
                    }
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (JSON.stringify(data) === JSON.stringify({ "msg": "online" })) {
                    connectionError = false;
                    errorMsg = '';
                    connecting = false;
                    success = true;

                    // worked, redirect to the dashboard and set cookies
                    if (success) {
                        setTimeout(() => {
                            // set the cookies
                            Cookies.set('serverIP', serverIP, { expires: 7 });
                            Cookies.set('serverPort', serverPort, { expires: 7 });

                            if (useHTTPS) {
                                Cookies.set('useHTTPS', 't', { expires: 7 });
                            } else {
                                Cookies.set('useHTTPS', 'f', { expires: 7 });
                            }

                            // redirect
                            open = false;
                            window.location.href = '/dashboard';
                        }, 1000);
                    }
                } else {
                    connectionError = true;
                        errorMsg = 'Wrong reply from the server. (Was not "online")';
                        connecting = false;
                        success = false;
                }
            })
            .catch(error => {
                console.error('There was a problem with the request:', error);
                connecting = false;
                errorMsg = error;
                connectionError = true;
                success = false;
            });

    }


</script>

<svelte:head>
    <title>Dashboard - Peek</title>
    <meta name="description" content="Connect and view the statistics of a Peek server" />
</svelte:head>

<Modal title="Connect To Server" bind:open={open} action="/dashboard" on:submit={handleSubmit} class="h-full w-full">
    <div class="mb-6">
        <Label for="ip-input" class="block mb-2">Domain/IP</Label>
        <Input id="ip-input" bind:value={serverIP} size="lg" placeholder="127.0.0.1"  />
    </div>
    <div class="mb-6">
        <Label for="port-input" class="block mb-2">Port</Label>
        <Input id="port-input" bind:value={serverPort} size="lg" placeholder="42649"/>
    </div>
    <div class="mb-6">
        <Checkbox bind:value={useHTTPS} id="https-input" checked>This server uses HTTPS</Checkbox>
    </div>

    <div class="">
        <Button shadow color="dark" href="/help#connecting">Help!</Button>
        <Button shadow color="blue" on:click={handleSubmit}>Connect!</Button>
    </div>
    {#if connecting}
        <p class="animate-pulse italic">Connecting...</p>
    {/if}
    {#if connectionError}
        <p class="text-red-600 italic">Error!: {errorMsg}</p>
    {/if}
    {#if success}
        <p class="text-green-600 italic">You're connected!</p>
    {/if}

</Modal>
