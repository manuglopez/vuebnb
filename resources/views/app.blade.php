<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Vuebnb</title>

    @vite(['resources/assets/css/app.scss', 'resources/assets/js/main.js'])
</head>
<body>
<div id="app"></div>
<script type="text/javascript">
    window.server_data = "{!! addslashes(json_encode($data)) !!}"
</script>
</body>
</html>
