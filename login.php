<?php

require_once __DIR__ . '/config.php';

session_start();

if ($_GET['code'] == ADMIN_KEY)
	$_SESSION['admin'] = 'adminmode';

header('Location: index.html');
