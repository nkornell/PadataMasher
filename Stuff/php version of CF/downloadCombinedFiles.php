<!-- https://www.w3schools.com/php/php_ajax_php.asp -->
<?php
if (!isset ($_SESSION)) session_start();

// get the q parameter from URL
$input = $_REQUEST["q"];
echo $_SESSION['columnNames'] . " " . $input;
?>