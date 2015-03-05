<?php

header('Content-type: image/jpeg');

$x = $_GET['x'];
$y = $_GET['y'];
$w = $_GET['x2']-$_GET['x'];
$h = $_GET['y2']-$_GET['y'];

$img = imagecreatefromjpeg('map.jpg');
$dst = imagecreatetruecolor($w, $h);
imagecopy($dst, $img, 0, 0, $x, $y, $w, $h);
imagejpeg($dst);
