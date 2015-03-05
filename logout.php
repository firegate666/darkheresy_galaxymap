<?php

require_once __DIR__ . '/config.php';

session_start();
$_SESSION = array();
session_destroy();
header('Location: index.html');
