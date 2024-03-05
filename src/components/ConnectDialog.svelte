<script>
    import { Modal, Button, P, Input, Label, Checkbox} from "flowbite-svelte"
    import {document} from "postcss";
    let open = true

    let formData = {
        // Define any initial form data
        serverIP: '127.0.0.1',
        serverPort: '42649',
        useHTTPS: false
    };

    let connectionError = false;
    let errorMsg = '';
    let connecting = false;
    let success = false;


    function handleSubmit(event) {
        event.preventDefault();
        console.log("ConnectForm submitted: ", formData);

        // vars for data
        let serverIP   = document.getElementById('ip-input').value;
        let serverPort = document.getElementById('port-input').value;
        let useHTTPS   = document.getElementById('https-input').value;

        // set the right flags
        connecting = true;
        success = false;
        connectionError = false;
        errorMsg = '';

        // make a request to the server
        if (formData.serverIP === '' || formData.serverPort === '') {
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
    <title>Connect - Peek</title>
    <meta name="description" content="Connect and view the statistics of a Peek server" />
</svelte:head>

<Modal title="Connect To Server" bind:open={open} on:submit={handleSubmit} class="h-full w-full">
    <div class="mb-6">
        <Label for="ip-input" class="block mb-2">Domain/IP</Label>
        <Input id="ip-input" size="lg" placeholder="127.0.0.1"  />
    </div>
    <div class="mb-6">
        <Label for="port-input" class="block mb-2">Port</Label>
        <Input id="port-input" size="lg" placeholder="42649"/>
    </div>
    <div class="mb-6">
        <Checkbox id="https-input" checked>This server uses HTTPS</Checkbox>
    </div>

    <div class="">
        <Button shadow color="dark" href="/help#connecting">Help!</Button>
        <Button shadow color="blue" on:click={handleSubmit}>Connect!</Button>
    </div>

</Modal>
