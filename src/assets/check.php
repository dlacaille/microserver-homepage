<?php
function check()
{
    header('Content-Type: application/json');
    exec('curl -s -o /dev/null -w "%{http_code}" ' . $_GET['url'], $result);
    print json_encode($result[0]);
}

check();
