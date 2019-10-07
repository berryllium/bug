<?php
require ("PHPMailer-master/src/PHPMailer.php");
require ("PHPMailer-master/src/SMTP.php");
if (isset($_POST['send_type'])) {
	$send_type = $_POST['send_type'];
	$name = $_POST['name'];
    $number = $_POST['number'];
    $email = $_POST['email'];
    $theme = $_POST['theme'];
	$good = $_POST['good'];
	$feedback = $_POST['feedback'];
	$sex = $_POST['sex'];

	
	if ($send_type == 'feedback') {
		$text = "Имя клиента: " . $name
		."\r\nТелефон: " .$number
		."\r\nE-mail: " .$email
		."\r\nОтзыв: " .$feedback;
	} elseif ($send_type == 'call_us') {
		$text = "Имя клиента: " . $name
		."\r\nТелефон: " .$number
		."\r\nE-mail: " .$email;
	} elseif ($send_type == 'subscribe') {
		$text = "\r\nE-mail: " .$email
		."\r\nПол: " .$sex;
	}
	else {
		$text = "Имя клиента: " . $name
		."\r\nТелефон: " .$number
		."\r\nE-mail: " .$email
		."\r\nТовар: " .$good;
	} 
		
	$success = 'Спасибо, ' . $_POST['name'] . '! Скоро мы с Вами свяжемся!';
    $header = 'From: me-invest@bk.ru';
	
	// если настроена почта, то раскомментируй следующую строку, а то, что дальше закомментируй	
	mail('me-invest@bk.ru', $theme, $text, $header);
	mail('gorkundp@yandex.ru', $theme, $text, $header);

}
?>