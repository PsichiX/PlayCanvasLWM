<?php
if(isset($_GET['file']))
{
    $fname = $_GET['file'];
    $fnameparts = explode('/');
    foreach($fnameparts as $part)
    {
        if($part === '.' || $part === '..')
            die('Path cannot contains dots!');
    }
    $fname = 'lwmcontent/'.$fname;
    if(file_exists($fname) && is_readable($fname)) {
        header('Content-type: application/octet-stream');
        header('Content-length: '.filesize($fname));
        if(isset($_SERVER['HTTP_ORIGIN']))
        {
            header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
            header('Access-Control-Allow-Credentials: false');
            header('Access-Control-Max-Age: 86400');
        }
        if($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
        {
            if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header('Access-Control-Allow-Headers: '.$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
        }
        $file = @ fopen($fname, 'rb');
        if ($file)
        {
            fpassthru($file);
            exit;
        }
    }
    else
        die('File does not exists on server or is not readable!');
}
?>
