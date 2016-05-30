<?php
	session_start();
	include('conexion.php');
		
		//If not isset -> set with dumy value so it doesn't complain unexpectedly echoing  HTML full of "Notice: Undefined index"
		if (!isset($_POST['login_userci']))
		{$_POST['login_userci'] = "";} 
		if (!isset($_POST['login_userpass']))
		{$_POST['login_userpass'] = "";} 
		
	$tipo_am=$_POST['tipo_am'];
		
switch ($tipo_am) {
    case "login":
	if ( !isset($_SESSION['username']) && !isset($_SESSION['userid']) ){		
			if ( @mysql_select_db($bd_base, $con) ){
				
				$sql = 'SELECT CI,pass,tipo_usuario FROM usuarios WHERE CI="' . $_POST['login_userci']. '" && pass="' . $_POST['login_userpass'] . '" && status="OK" LIMIT 1'; // md5($_POST['login_userpass']) wasn't working
				if ( @$res = @mysql_query($sql) ){
					if ( @mysql_num_rows($res) == 1 ){
						
						$user = @mysql_fetch_array($res);
						
						$_SESSION['username']	= $user['tipo_usuario'];
						$_SESSION['userid']	= $user['CI'];
						if ( $_SESSION['username'] == "Administrador" ){
						
						echo 3;
						
						}
						else
						echo 1;
						
					}
					else
						echo 0;
				}
				else
					echo 0;
				
				
			}
			mysql_close($con);
	}
	else{
		//ALREADY LOGGED

				$sql = 'SELECT CI,pass,tipo_usuario FROM usuarios WHERE CI="' . $_POST['login_userci']. '" && pass="' . $_POST['login_userpass'] . '" && status="OK" LIMIT 1'; // md5($_POST['login_userpass']) wasn't working
				if ( @$res = @mysql_query($sql) ){
					if ( @mysql_num_rows($res) == 1 ){
						
						$user = @mysql_fetch_array($res);
						
						if ( $_SESSION['username']==$user['tipo_usuario'] && $_SESSION['userid']==$user['CI']){
							if ( $_SESSION['username'] == "Administrador" ){
							
							echo 3;
							
							}
							else
							echo 1;
						}
					else
						{//otra persona intenta logear desde el mismo equipo, se borra la sesión anterior.
						unset($_SESSION['username']); 
						unset($_SESSION['userid']); 
						$_SESSION['username']	= $user['tipo_usuario'];
						$_SESSION['userid']	= $user['CI'];
						if ( $_SESSION['username'] == "Administrador" ){
						
						echo 3;
						
						}
						else
						echo 1;
						}
						
					}
					else
						echo 0;
				}
				else
					echo 0;
			
		}
	@mysql_close();
	break;
case "chk":
       // revisa la sesión
					if ( $_SESSION['username'] == "Administrador" ){
						
						echo 3;
						
						}
						else
						echo 1;
   break;
}
 
?>

