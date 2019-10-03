<?php
require ("PHPMailer-master/src/PHPMailer.php");
require ("PHPMailer-master/src/SMTP.php");
if (isset($_POST['name']) && isset($_POST['number']) && isset($_POST['email']) && isset($_POST['theme']) && isset($_POST['good'])) {
    $name = $_POST['name'];
    $number = $_POST['number'];
    $email = $_POST['email'];
    $theme = $_POST['theme'];
    $good = $_POST['good'];
    $category = $_POST['category'];
		$text = "Имя клиента: " . $name
		."<br>Телефон: " .$number
		."<br>E-mail: " .$email
		."<br>Товар: " .$good
		."<br>Категория: ".$category;
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
		$mail->AddAddress('gorkundp@yandex.ru');
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