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
		."<br>Телефон: " .$number
		."<br>E-mail: " .$email
		."<br>Отзыв: " .$feedback;
	} elseif ($send_type == 'call_us') {
		$text = "Имя клиента: " . $name
		."<br>Телефон: " .$number
		."<br>E-mail: " .$email;
	} elseif ($send_type == 'subscribe') {
		$text = "<br>E-mail: " .$email
		."<br>Пол: " .$sex;
	}
	else {
		$text = "Имя клиента: " . $name
		."<br>Телефон: " .$number
		."<br>E-mail: " .$email
		."<br>Товар: " .$good;
	}
	$mailto = 'me-invest@bk.ru';
	$fromName = 'Luxor-shop';
	$fromEmail = 'luxor@me-invest.ru';
	$success = 'Спасибо, ' . $_POST['name'] . '! Скоро мы с Вами свяжемся!';
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=utf-8" . "\r\n";
    $headers .= 'From: ' . $fromName . ' <' . $fromEmail .'>' . " \r\n";
	

		if (mail($mailto, $theme, $text, $headers)) {
			$result = 'Ошибка отправки формы: ' . $mail->ErrorInfo;
			return;
		} else {
			$result = $success;
			return;
		}
		
	
     
} else {
	
    $result = 'Ой, что-то пошло не так. Отправка данных не выполнена, попробуйте позднее!'.$name.$email.$number.$good;
}
echo $result;
?>