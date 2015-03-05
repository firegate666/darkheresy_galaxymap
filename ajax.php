<?php
require_once __DIR__ . '/config.php';

session_start();
$admin = $_SESSION['admin'] == 'adminmode';
header('Content-Type: text/javascript');
$result = '';

if (isset($_GET['admin']))
	$result['admin'] = ($admin)?1:0;
else { // db action need connection
	$conn = mysql_connect(DB_HOST, DB_USER, DB_PASS);
	mysql_select_db(DB_NAME, $conn);

	if (!empty($_GET['save'])) {
		if (!$admin)
			$result['error'] = 'Saving disabled. Please login to edit planet details.';
		else if (!empty($_GET['x']) && !empty($_GET['y']) && !empty($_GET['x2']) && !empty($_GET['y2']) && !empty($_GET['name']) && !empty($_GET['type']) ) {
			$query = "INSERT INTO planet (createdate, x, y, x2, y2, name, type) VALUES " .
					"(".time()."," .
					intval($_GET['x']).", " .
					intval($_GET['y']).", " .
					intval($_GET['x2']).", " .
					intval($_GET['y2']).", " .
					"'".htmlentities($_GET['name'])."',".
					"'".htmlentities($_GET['type'])."');";
			mysql_query($query, $conn);

			$error = mysql_error();
			if (!empty($error))
				$result['error'] = $error;
			else if (mysql_affected_rows($conn))
				$result['ok'] = '1';
			else
				$result['error'] = mysql_error($conn).': '.$query;
		} else
			$result['error'] = 'Missing parameters.';

	} else if (!empty($_GET['x']) && !empty($_GET['y'])) {
		$xx = intval($_GET['x']);
		$yy = intval($_GET['y']);
		$query = "SELECT * FROM planet WHERE x2 > $xx AND x < $xx AND y2 > $yy AND y < $yy;";
		$res = mysql_query($query, $conn);
		$error = mysql_error();
		if (!empty($error))
			$result['error'] = $error;
		else if (mysql_affected_rows($conn)) {
			$result = mysql_fetch_assoc($res);
			$result['position_x'] = $result['x'] + (($result['x2']-$result['x'])/2);
			$result['position_y'] = $result['y'] + (($result['y2']-$result['y'])/2);
		}
	}
}

die(json_encode($result));
