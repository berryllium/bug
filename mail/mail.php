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
		
	$success = 'Спасибо, ' . $_POST['name'] . '! Скоро мы с Вами свяжемся!';
    $header = 'From: freestuff47.ru@beget.com\r\n';
	
// если настроена почта, то раскомментируй следующую строку, а то, что дальше закомментируй	
//	mail('gorkundp@yandex.ru', 'Туры в Австралию', $text, $header);

		
		$mail = new PHPMailer\PHPMailer\PHPMailer();
		$mail->IsSMTP(); // enable SMTP
		$mail->SMTPDebug = 0; // debugging: 1 = errors and messages, 2 = messages only
		$mail->SMTPAuth = true; // authentication enabled
		$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
		$mail->Host = 'ssl://smtp.beget.com';
		$mail->Port = 465;
		$mail->Username = 'australia@freestuff47.ru';
		$mail->Password = 'Placebo1';
		$mail->IsHTML(true);
		$mail->SetFrom('australia@freestuff47.ru');
		$mail->Subject = $theme;
		$mail->Body = $text;
		$mail->AddAddress('me-invest@bk.ru');
		if (!$mail->Send()) {
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