<script>
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

        // get the form data
        formData.serverIP = document.getElementById('serverip').value;
        formData.serverPort = document.getElementById('port').value;
        formData.useHTTPS = document.getElementById('https').checked;

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

        let url = `${formData.serverIP}:${formData.serverPort}/api/heartbeat/`;
        if (formData.useHTTPS) {
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

<form on:submit={handleSubmit}>
    <div class="">
        <div class="p-4 bg-gray-50 rounded-lg flex flex-col gap-4 w-full max-w-m">
            <h3 class="font-bold italic">Welcome to PeekUI!</h3>
            <div class="text-sm text-gray-500 dark:text-gray-400">
                <p>It seems like you're not connected.</p>
                <p>Please, connect to the server to continue.</p>
            </div>

            <div class="">
                <div class="flex flex-col gap-2">
                    <label for="serverip" class="text-sm font-medium italic">Domain or server IP-address:</label>
                    <input type="text" id="serverip" name="serverip" bind:value={formData.serverIP}
                           class="h-10 px-4 rounded-md border border-slate-200 text-slate-900" />
                </div>
                <div class="pt-3 flex flex-col gap-2">
                    <label for="port" class="text-sm font-medium italic">Port:</label>
                    <input type="text" id="port" name="port" placeholder="42649" bind:value={formData.serverPort}
                           class="h-10 px-4 rounded-md border border-slate-200 text-slate-900" />
                </div>

                <div class="pt-2 flex flex-row ">
                    <div class="pr-2">
                        <label for="https" class="text-sm font-medium italic">This server uses HTTPS</label>
                    </div>
                    <div>
                        <input id="https" type="checkbox" bind:value={formData.useHTTPS}>
                    </div>

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
            </div>

            <div class="flex space-x-4 mb-6 text-sm font-medium justify-items-end">
                <div class="flex-auto flex space-x-4 justify-end">
                    <button class="text-white font-bold py-2 px-4 rounded bg-gradient-to-r from-gray-500 to-gray-600 hover:from-neutral-500 hover:to-gray-900"
                            type="button" onclick="location.href='/help';" value="Get help">
                        Help!
                    </button>
                    <button class="text-white font-bold py-2 px-4 rounded bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900" type="submit">
                        Connect!
                    </button>

                </div>

            </div>
        </div>
    </div>

</form>
