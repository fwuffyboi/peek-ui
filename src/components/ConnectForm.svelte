<script>
    import {json} from "@sveltejs/kit";

    let formData = {
        // Define any initial form data
        serverIP: '',
        serverPort: '42649',
        useHTTPS: false
    };

    let connectionError = false;
    let errorMsg = '';
    let connecting = false;
    let success = false;


    async function handleSubmit(event) {
        event.preventDefault();
        // Execute your JavaScript code here
        console.log("ConnectForm submitted: ", formData);

        // get the form data
        formData.serverIP = document.getElementById('serverip').value;
        formData.serverPort = document.getElementById('port').value;
        formData.useHTTPS = document.getElementById('https').checked;

        // set the connecting flag
        connecting = true;

        // make a request to the server
        if (formData.serverIP === '' || formData.serverPort === '') {
            connectionError = true;
            errorMsg = 'Please enter a server IP and port';
            connecting = false;
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

                    console.log(response);
                    if (response.status === 429) {
                        errorMsg = 'Too many requests!';
                        throw new Error('Too many requests!');
                    }

                } else {
                    console.log(response);
                    if (response.status === 200) {
                        success = true;
                        connecting = false;
                        errorMsg = '';
                        connectionError = false;
                    }
                }
                success = true;
                connecting = false;
                errorMsg = '';
                connectionError = false;
                return response.json(); // Parse response as JSON
            })
            .then(data => {
                connecting = false;
                success = true;
                connectionError = false;
                errorMsg = '';
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
    <div class="font-sans">
        <div class="p-4 bg-gray-50 rounded-lg flex flex-col gap-4 w-full max-w-m">
            <h3 class="font-bold italic">Добро пожаловать в PeekUI!</h3>
            <div class="text-sm text-gray-500 dark:text-gray-400">
                <p>Похоже, вы не подключены.</p>
                <p>Пожалуйста, подключитесь к серверу, чтобы продолжить.</p>
            </div>

            <div class="">
                <div class="flex flex-col gap-2">
                    <label for="serverip" class="text-sm font-medium italic">Домен сервера или IP-адрес:</label>
                    <input type="text" id="serverip" name="serverip" bind:value={formData.serverIP}
                           class="h-10 px-4 rounded-md border border-slate-200 text-slate-900" />
                </div>
                <div class="pt-3 flex flex-col gap-2">
                    <label for="port" class="text-sm font-medium italic">Порт:</label>
                    <input type="text" id="port" name="port" placeholder="42649" bind:value={formData.serverPort}
                           class="h-10 px-4 rounded-md border border-slate-200 text-slate-900" />
                </div>

                <div class="pt-2 flex flex-row ">
                    <div class="pr-2">
                        <label for="https" class="text-sm font-medium italic">Этот сервер использует HTTPS</label>
                    </div>
                    <div>
                        <input id="https" type="checkbox" bind:value={formData.useHTTPS}>
                    </div>

                </div>
                {#if connecting}
                    <p class="animate-pulse italic">Связывающий...</p>
                {/if}
                {#if connectionError}
                    <p class="text-red-600 italic">Ошибка!: {errorMsg}</p>
                {/if}
                {#if success}
                    <p class="text-green-600 italic">Успех! Вы связаны.</p>
                {/if}
            </div>

            <div class="flex space-x-4 mb-6 text-sm font-medium justify-items-end">
                <div class="flex-auto flex space-x-4 justify-end">
                    <button class="text-white font-bold py-2 px-4 rounded bg-gradient-to-r from-gray-500 to-gray-600 hover:from-neutral-500 hover:to-gray-900" type="button">
                        Помогите!
                    </button>
                    <button class="text-white font-bold py-2 px-4 rounded bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900" type="submit">
                        Подключайся!
                    </button>

                </div>
            </div>
        </div>
    </div>

</form>
