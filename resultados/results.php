<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; charset=utf-8');

$archivo_html = $_GET["url"];

if (file_exists($archivo_html) && is_file($archivo_html)) {
    $contenido = file_get_contents($archivo_html);
   echo utf8_encode($contenido);
} else {
    echo '<pre>Los resultados solicitados no estan disponibles.</pre>';
}
?>