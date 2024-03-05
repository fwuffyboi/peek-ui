<script>
    import { page } from '$app/stores';

    let status = 0;
    let error = '';
    const ghIssueLink = 'https://github.com/fwuffyboi/peek-ui/issues';
    let moreInfoText = 'Если вы считаете, что это ошибка, или хотели бы получить помощь, пожалуйста, создайте проблему на GitHub здесь: ';
    if ($page.status === 404) {
        status = 404;
        error = 'Файл или ресурс не найден.';
    } else {
        status = "???";
        error = 'Unknown.';
    }
</script>

<div class="flex flex-col w-full max-w-m">
    <div class="bg-gray-50 rounded-lg gap-4 p-4 pr-10">
        <h1 class="text-7xl italic">Ошибка {status}</h1>
        <h2 class="">{error}</h2>
        <br>
        <h2 class="">{moreInfoText}
            <a class="text-blue-600" href={ghIssueLink}>{ghIssueLink}</a>
        </h2>

    </div>

</div>
