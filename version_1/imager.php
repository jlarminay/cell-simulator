<?php

header("Content-type: image/png");
$string = $_GET['col'];

$set = [0,0,0];
$set[0] = hexdec(substr($string, 0, 2));
$set[1] = hexdec(substr($string, 2, 2));
$set[2] = hexdec(substr($string, 4, 2));

$im = imagecreatetruecolor(255, 255);

$col = imagecolorallocate($im, $set[0], $set[1], $set[2]);

imagefill($im, 0, 0, $col);
imagepng($im);
imagedestroy($im);

?>