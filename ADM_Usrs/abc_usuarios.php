<?php
        include('../conexion.php');
	session_start();
	
	    //If not isset -> set with dumy value so it doesn't complain unexpectedly echoing  HTML full of "Notice: Undefined index"
		if (!isset($_POST['userci']))
		{$_POST['userci'] = "";} 
		if (!isset($_POST['SearchData']))
		{$_POST['SearchData'] = "";} 
		if (!isset($_POST['username']))
		{$_POST['username'] = "";}
		if (!isset($_POST['userlastname1']))
		{$_POST['userlastname1'] = "";}		
		if (!isset($_POST['userlastname2']))
		{$_POST['userlastname2'] = "";}
		if (!isset($_POST['password']))
		{$_POST['password'] = "";}
		if (!isset($_POST['password1']))
		{$_POST['password1'] = "";}
		if (!isset($_POST['usertype']))
		{$_POST['usertype'] = "";}
		if (!isset($_POST['userstatus']))
		{$_POST['userstatus'] = "";}
		
        //variables POST
        $userci=$_POST['userci'];
		$SearchData=$_POST['SearchData'];
        $username=trim($_POST['username']);
        $userlastname1=trim($_POST['userlastname1']);
        $userlastname2=trim($_POST['userlastname2']);
        $password=trim($_POST['password']);
		$password1=trim($_POST['password1']);
        $usertype=trim($_POST['usertype']);
        $userstatus=trim($_POST['userstatus']);
		


        $tipo_am=$_POST['tipo_am'];
		
switch ($tipo_am) {
    case "alta":
        // GRABAR
$sql="INSERT INTO usuarios (CI, nombre, Apellido_P, Apellido_M, pass, tipo_usuario, status) VALUES ('$userci','$username','$userlastname1','$userlastname2','$password','$usertype','$userstatus')";             
		mysql_query($sql,$con);
		mysql_close();
		echo 1;
        break;
    case "baja":
       // DAR DE BAJA (NOTE QUE SOLO CAMBIA UN FLAG)
		$sql="UPDATE usuarios SET status='$userstatus' WHERE CI='$userci'";
		mysql_query($sql,$con);
		mysql_close();
		echo 1;
        break;
	case "CambioPass":
       // Cambio de Pass
			$sql = "SELECT CI,pass,tipo_usuario FROM usuarios WHERE CI='$userci' && pass='$password' && status='OK' LIMIT 1";
				if ( @$res = @mysql_query($sql,$con) ){
					if ( @mysql_num_rows($res) == 1 ){
						
					$sql="UPDATE usuarios SET pass='$password1' WHERE CI='$userci'";
                    mysql_query($sql,$con);
                    mysql_close();
                    echo 3;//change OK
					break;
					}
					else
                        mysql_close();
						echo 0;//something wrong with the user maybe changing someone else's
						break;
				}
				else
                    mysql_close();
					echo 0;//wrong ci or pass 
       				break;
	case "modificar":
       // MODIFICAR
		$sql="UPDATE usuarios SET nombre='$username', Apellido_P='$userlastname1', Apellido_M='$userlastname2', tipo_usuario='$usertype' WHERE CI='$userci'";
		mysql_query($sql,$con);
		mysql_close();
		echo 1;
        break;
    case "buscar":
         // BUSCAR
		 $sql = "SELECT * FROM usuarios WHERE status='OK' &&( CI='$SearchData' || nombre like '%".$SearchData."%' )LIMIT 1";
	     $resultID = @mysql_query($sql, $con);
		 $numfilas= @mysql_num_rows($resultID);
		    
			$xml_output = "<?xml version=\"1.0\"?>\n";
			$xml_output .= "<entries>\n";
			
			for($x = 0 ; $x < @mysql_num_rows($resultID) ; $x++){
				$row = @mysql_fetch_assoc($resultID); 
				$xml_output .= "\t<entry>\n";
				$xml_output .= "\t\t<userci>" . $row['CI'] . "</userci>\n";
				$xml_output .= "\t\t<username>" . $row['nombre'] . "</username>\n";
				$xml_output .= "\t\t<userlastname1>" . $row['Apellido_P'] . "</userlastname1>\n";
				$xml_output .= "\t\t<userlastname2>" . $row['Apellido_M'] . "</userlastname2>\n";
				//$xml_output .= "\t\t<password>" . $row['pass'] . "</password>\n";
				$xml_output .= "\t\t<usertype>" . $row['tipo_usuario'] . "</usertype>\n";
				$xml_output .= "\t</entry>\n";
			}
			
			$xml_output .= "</entries>";
			
			$xml_output=iconv("ISO-8859-1","UTF-8",$xml_output);
			echo $xml_output; 

		mysql_close();
		break;
}
        
?>

				
				
			

